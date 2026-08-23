import { Student } from '../models/Student';
import { Room } from '../models/Room';
import { Allocation, IAllocation } from '../models/Allocation';
import { rankRooms } from '../engines/smartFit.engine';

import mongoose from 'mongoose';
import { RoomOccupancy } from '../models/RoomOccupancy';
import { AllocationEvaluation } from '../models/AllocationEvaluation';
import { AllocationHistory } from '../models/AllocationHistory';
import { AuditLog } from '../models/AuditLog';

export const allocateStudent = async (studentId: string, durationDays = 180): Promise<IAllocation> => {
  if (!Number.isInteger(durationDays) || durationDays < 1 || durationDays > 3650) {
    throw new Error('Duration must be between 1 and 3650 days');
  }
  const endsAt = new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000);
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const student = await Student.findById(studentId).session(session);
    if (!student) throw new Error('Student not found');

    if (student.allocation?.roomNo) {
      throw new Error('Student is already allocated a room');
    }

    // Use find for all rooms, then filter in memory for SmartFit (existing behavior)
    const rooms = await Room.find().session(session);
    const availableRooms = rooms.filter(r => r.occupants.length < r.capacity && r.status === 'AVAILABLE');

    if (availableRooms.length === 0) {
      throw new Error('No available rooms');
    }

    const candidates = rankRooms(student, availableRooms);
    if (candidates.length === 0) {
      throw new Error('No eligible rooms found for the student');
    }

    const bestCandidate = candidates[0];
    
    // Atomically re-fetch and lock the selected room
    const selectedRoom = await Room.findOneAndUpdate(
      { _id: bestCandidate.room._id, $expr: { $lt: [{ $ifNull: ["$occupancy.current", { $size: "$occupants" }] }, "$capacity"] } },
      { 
        $push: { occupants: student.id },
        $inc: { 'occupancy.current': 1 }
      },
      { new: true, session }
    );
    
    if (!selectedRoom) throw new Error('Concurrency Error: Room became full during allocation');
    await selectedRoom.save({ session });

    // Update Student allocation status
    student.allocation = {
      roomNo: selectedRoom.roomNo,
      score: bestCandidate.totalScore,
    };
    await student.save({ session });

    // Create Allocation record
    const allocation = new Allocation({
      studentId: student.id,
      roomId: selectedRoom._id,
      roomNo: selectedRoom.roomNo,
      totalScore: bestCandidate.totalScore,
      scoreBreakdown: bestCandidate.scoreBreakdown,
      reason: bestCandidate.reason,
      status: 'PENDING',
      endsAt,
      allocatedBy: 'SYSTEM',
      smartFit: {
        totalScore: bestCandidate.totalScore,
        rank: 1,
        candidatesEvaluated: availableRooms.length
      }
    });
    await allocation.save({ session });

    // V2: Create RoomOccupancy
    await RoomOccupancy.create([{
      roomId: selectedRoom._id,
      studentId: student.id,
      allocationId: allocation._id,
      status: 'ACTIVE',
      checkIn: new Date(),
      endsAt,
    }], { session });

    // V2: Create AllocationEvaluation
    await AllocationEvaluation.create([{
      studentId: student.id,
      selectedRoomId: selectedRoom._id,
      candidates: candidates.map((c, idx) => ({
        roomId: c.room._id,
        roomNo: c.room.roomNo,
        eligible: true,
        rejectionReasons: [],
        score: c.totalScore,
        breakdown: c.scoreBreakdown,
        rank: idx + 1
      }))
    }], { session });

    // V2: Create AllocationHistory
    await AllocationHistory.create([{
      studentId: student.id,
      roomId: selectedRoom._id,
      allocationId: allocation._id,
      event: 'ALLOCATED',
      score: bestCandidate.totalScore,
      scoreBreakdown: bestCandidate.scoreBreakdown,
      reason: bestCandidate.reason,
      actor: 'SYSTEM'
    }], { session });

    // V2: Create AuditLog
    await AuditLog.create([{
      entityType: 'ALLOCATION',
      entityId: allocation._id,
      action: 'SYSTEM_ALLOCATED',
      newState: allocation.toObject()
    }], { session });

    await session.commitTransaction();
    session.endSession();

    return allocation;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

export const getAllocations = async (): Promise<IAllocation[]> => {
  return await Allocation.find().populate('studentId', 'name registerNo department').sort({ allocatedAt: -1 });
};

export const getAllocationByStudentId = async (studentId: string): Promise<IAllocation | null> => {
  return await Allocation.findOne({ studentId }).populate('studentId', 'name registerNo department');
};

export const getAllocationHistory = async (studentId: string) => {
  return await AllocationHistory.find({ studentId })
    .populate('roomId', 'roomNo floor roomType')
    .sort({ createdAt: -1 });
};

export const closeAllocation = async (
  studentId: string,
  event: 'CANCELLED' | 'VACATED',
  reason: string,
  actor: 'ADMIN' | 'STUDENT'
) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const allocation = await Allocation.findOne({
      studentId,
      status: { $in: ['PENDING', 'ALLOCATED'] },
    }).session(session);
    if (!allocation) throw new Error('Active allocation not found');

    const room = allocation.roomId ? await Room.findById(allocation.roomId).session(session) : null;
    if (room) {
      room.occupants = room.occupants.filter((occupant) => occupant.toString() !== studentId);
      await room.save({ session });
    }

    await RoomOccupancy.updateMany(
      { allocationId: allocation._id, status: 'ACTIVE' },
      { status: 'ENDED', checkOut: new Date() },
      { session }
    );
    allocation.status = 'CANCELLED';
    await allocation.save({ session });
    await Student.findByIdAndUpdate(studentId, { $unset: { allocation: 1 } }, { session });
    await AllocationHistory.create([{
      studentId,
      roomId: allocation.roomId,
      allocationId: allocation._id,
      event,
      reason,
      actor,
    }], { session });
    await AuditLog.create([{
      entityType: 'ALLOCATION',
      entityId: allocation._id,
      action: event === 'VACATED' ? 'ALLOCATION_VACATED' : 'ALLOCATION_REJECTED',
      metadata: { reason, actor },
    }], { session });
    await session.commitTransaction();
    return allocation;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

export const releaseExpiredAllocations = async () => {
  const expired = await Allocation.find({
    status: { $in: ['PENDING', 'ALLOCATED'] },
    endsAt: { $lte: new Date() },
  }).select('studentId');

  for (const allocation of expired) {
    try {
      await closeAllocation(allocation.studentId.toString(), 'CANCELLED', 'Booking duration ended automatically', 'ADMIN');
    } catch (error) {
      console.error(`Failed to release expired allocation for ${allocation.studentId.toString()}:`, error);
    }
  }

  return expired.length;
};

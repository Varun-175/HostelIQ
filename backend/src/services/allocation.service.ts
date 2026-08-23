import { Student } from '../models/Student';
import { Room } from '../models/Room';
import { Allocation, IAllocation } from '../models/Allocation';
import { rankRooms } from '../engines/smartFit.engine';

export const allocateStudent = async (studentId: string): Promise<IAllocation> => {
  const student = await Student.findById(studentId);
  if (!student) throw new Error('Student not found');

  if (student.allocation?.roomNo) {
    throw new Error('Student is already allocated a room');
  }

  const rooms = await Room.find();
  const availableRooms = rooms.filter(r => r.occupants.length < r.capacity);

  if (availableRooms.length === 0) {
    throw new Error('No available rooms');
  }

  const candidates = rankRooms(student, availableRooms);
  if (candidates.length === 0) {
    throw new Error('No eligible rooms found for the student');
  }

  const bestCandidate = candidates[0];
  const selectedRoom = await Room.findById(bestCandidate.room._id);
  
  if (!selectedRoom) throw new Error('Room not found during allocation');

  // Update Room occupants
  selectedRoom.occupants.push(student.id);
  await selectedRoom.save();

  // Update Student allocation status
  student.allocation = {
    roomNo: selectedRoom.roomNo,
    score: bestCandidate.totalScore,
  };
  await student.save();

  // Create Allocation record
  const allocation = new Allocation({
    studentId: student.id,
    roomNo: selectedRoom.roomNo,
    totalScore: bestCandidate.totalScore,
    scoreBreakdown: bestCandidate.scoreBreakdown,
    reason: bestCandidate.reason,
  });

  return await allocation.save();
};

export const getAllocations = async (): Promise<IAllocation[]> => {
  return await Allocation.find().populate('studentId', 'name registerNo department').sort({ allocatedAt: -1 });
};

export const getAllocationByStudentId = async (studentId: string): Promise<IAllocation | null> => {
  return await Allocation.findOne({ studentId }).populate('studentId', 'name registerNo department');
};

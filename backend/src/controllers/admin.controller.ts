import { Request, Response } from 'express';
import { Student } from '../models/Student';
import { Room } from '../models/Room';
import { AllocationRequest } from '../models/AllocationRequest';
import { Allocation } from '../models/Allocation';
import { AuditLog } from '../models/AuditLog';

export const getDashboard = async (req: Request, res: Response) => {
  try {
    const totalStudents = await Student.countDocuments();
    const totalRooms = await Room.countDocuments();
    
    const rooms = await Room.find();
    
    let occupiedRooms = 0;
    let availableRooms = 0;
    let partialRooms = 0;
    let fullRooms = 0;
    let maintenanceRooms = 0;

    let totalBeds = 0;
    let occupiedBeds = 0;

    for (const room of rooms) {
      totalBeds += room.capacity;
      
      const currentOccupancy = room.occupancy?.current || room.occupants.length;
      occupiedBeds += currentOccupancy;

      if (room.status === 'MAINTENANCE') {
        maintenanceRooms++;
      } else if (currentOccupancy === 0) {
        availableRooms++;
      } else if (currentOccupancy > 0 && currentOccupancy < room.capacity) {
        partialRooms++;
        occupiedRooms++;
      } else if (currentOccupancy >= room.capacity) {
        fullRooms++;
        occupiedRooms++;
      }
    }

    const utilization = totalBeds > 0 ? (occupiedBeds / totalBeds) * 100 : 0;
    const pendingRequests = await AllocationRequest.countDocuments({ status: 'PENDING' });

    // Count allocations today
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const allocationsToday = await Allocation.countDocuments({
      createdAt: { $gte: startOfDay }
    });

    res.status(200).json({
      success: true,
      data: {
        totalStudents,
        totalRooms,
        occupiedRooms,
        availableRooms,
        partialRooms,
        fullRooms,
        maintenanceRooms,
        utilization,
        pendingRequests,
        allocationsToday
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllocationRequests = async (req: Request, res: Response) => {
  try {
    const { status, limit = 50, page = 1 } = req.query;
    
    const query: any = {};
    if (status) query.status = status;

    const skip = (Number(page) - 1) * Number(limit);

    const requests = await AllocationRequest.find(query)
      .populate('studentId', 'name registerNo department')
      .sort({ priority: -1, createdAt: 1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await AllocationRequest.countDocuments(query);

    res.status(200).json({
      success: true,
      data: requests,
      metadata: { total, page: Number(page), limit: Number(limit) }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createRoom = async (req: Request, res: Response) => {
  try {
    const room = new Room(req.body);
    await room.save();

    await AuditLog.create({
      entityType: 'ROOM',
      entityId: room._id,
      action: 'ROOM_CREATED',
      actorId: req.user?.id,
      actorRole: req.user?.role,
      newState: room.toObject()
    });

    res.status(201).json({ success: true, data: room });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const updateRoomStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // e.g. MAINTENANCE, AVAILABLE

    const room = await Room.findById(id);
    if (!room) return res.status(404).json({ success: false, message: 'Room not found' });

    const previousState = room.toObject();
    room.status = status;
    await room.save();

    await AuditLog.create({
      entityType: 'ROOM',
      entityId: room._id,
      action: 'ROOM_STATUS_UPDATED',
      actorId: req.user?.id,
      actorRole: req.user?.role,
      previousState,
      newState: room.toObject(),
      metadata: { statusChangedTo: status }
    });

    res.status(200).json({ success: true, data: room });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const reviewAllocation = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // request id or allocation id
    const allocation = await Allocation.findById(id).populate('studentId roomId');
    if (!allocation) return res.status(404).json({ success: false, message: 'Allocation not found' });
    
    // In a real app we'd fetch the AllocationEvaluation here using requestId or studentId
    res.status(200).json({ success: true, data: allocation });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const overrideAllocation = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // allocation id
    const { roomId, reason } = req.body;

    const allocation = await Allocation.findById(id);
    if (!allocation) return res.status(404).json({ success: false, message: 'Allocation not found' });

    const newRoom = await Room.findById(roomId);
    if (!newRoom) return res.status(404).json({ success: false, message: 'Target room not found' });

    // Validate capacity
    const currentOccupancy = newRoom.occupancy?.current || newRoom.occupants.length;
    if (currentOccupancy >= newRoom.capacity) {
      return res.status(400).json({ success: false, message: 'Room is at full capacity' });
    }

    const previousRoomId = allocation.roomId;

    // Update old room (simplified)
    if (previousRoomId) {
       await Room.findByIdAndUpdate(previousRoomId, { $pull: { occupants: allocation.studentId } });
    }

    // Update new room
    newRoom.occupants.push(allocation.studentId);
    if (newRoom.occupancy) {
      newRoom.occupancy.current += 1;
    }
    await newRoom.save();

    // Update allocation
    allocation.roomId = newRoom._id;
    allocation.roomNo = newRoom.roomNo;
    allocation.override = true;
    allocation.overrideReason = reason;
    allocation.allocatedBy = 'ADMIN';
    await allocation.save();

    // Create Audit Log
    await AuditLog.create({
      entityType: 'ALLOCATION',
      entityId: allocation._id,
      action: 'ALLOCATION_OVERRIDDEN',
      actorId: req.user?.id,
      actorRole: req.user?.role,
      metadata: { previousRoomId, newRoomId: newRoom._id, reason }
    });

    res.status(200).json({ success: true, data: allocation });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

import { Request, Response } from 'express';
import { Student } from '../models/Student';
import { Room } from '../models/Room';

export const search = async (req: Request, res: Response) => {
  try {
    const { q } = req.query;
    
    if (!q || typeof q !== 'string') {
      return res.status(400).json({ success: false, message: 'Query parameter "q" is required' });
    }

    // Try to parse query as a number for room search
    const parsedRoomNo = parseInt(q, 10);
    const roomQuery = !isNaN(parsedRoomNo) ? { roomNo: parsedRoomNo } : null;

    // Search students by name or registerNo (case-insensitive)
    const studentRegex = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    
    const [students, rooms] = await Promise.all([
      Student.find({
        $or: [
          { name: { $regex: studentRegex } },
          { registerNo: { $regex: studentRegex } }
        ]
      }).limit(10),
      
      roomQuery ? Room.find(roomQuery).limit(5) : Promise.resolve([])
    ]);

    res.status(200).json({
      success: true,
      data: {
        students,
        rooms
      }
    });

  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

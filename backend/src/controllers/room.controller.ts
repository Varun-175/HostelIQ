import { Request, Response } from 'express';
import * as roomService from '../services/room.service';

export const getRooms = async (req: Request, res: Response) => {
  try {
    const rooms = await roomService.getRooms();
    res.status(200).json({ success: true, data: rooms });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getRoom = async (req: Request, res: Response) => {
  try {
    const room = await roomService.getRoomByNo(Number(req.params.roomNo));
    if (!room) {
      return res.status(404).json({ success: false, message: 'Room not found' });
    }
    res.status(200).json({ success: true, data: room });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createRoom = async (req: Request, res: Response) => {
  try {
    const room = await roomService.createRoom(req.body);
    res.status(201).json({ success: true, data: room });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

import { Room, IRoom } from '../models/Room';

export const getRooms = async (): Promise<IRoom[]> => {
  return await Room.find().sort({ roomNo: 1 });
};

export const getAvailableRooms = async (): Promise<IRoom[]> => {
  const rooms = await getRooms();
  return rooms.filter(room => room.occupants.length < room.capacity);
};

export const getRoomByNo = async (roomNo: number): Promise<IRoom | null> => {
  return await Room.findOne({ roomNo }).populate('occupants', 'name registerNo department year');
};

export const createRoom = async (data: Partial<IRoom>): Promise<IRoom> => {
  const room = new Room(data);
  return await room.save();
};

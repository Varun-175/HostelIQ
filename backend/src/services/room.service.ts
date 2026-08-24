import { Room, IRoom } from '../models/Room';

export const getRooms = async (): Promise<IRoom[]> => {
  const rooms = await Room.find().sort({ roomNo: 1 });
  return rooms.map((room) => normalizeRoom(room));
};

export const getAvailableRooms = async (): Promise<IRoom[]> => {
  const rooms = await getRooms();
  return rooms.filter(room => room.status === 'AVAILABLE' && room.occupants.length < room.capacity);
};

export const getRoomByNo = async (roomNo: number): Promise<IRoom | null> => {
  const room = await Room.findOne({ roomNo }).populate('occupants', 'name registerNo department year');
  return room ? normalizeRoom(room) : null;
};

export const createRoom = async (data: Partial<IRoom>): Promise<IRoom> => {
  const room = new Room(data);
  normalizeRoom(room);
  return await room.save();
};

export const updateRoom = async (roomNo: number, data: Partial<IRoom>): Promise<IRoom | null> => {
  const room = await Room.findOne({ roomNo });
  if (!room) return null;
  Object.assign(room, data);
  normalizeRoom(room);
  return await room.save();
};

export const deleteRoom = async (roomNo: number): Promise<IRoom | null> => {
  const room = await Room.findOne({ roomNo });
  if (!room) return null;
  if (room.occupants.length > 0) {
    throw new Error('Cannot delete a room with occupants');
  }
  return await Room.findOneAndDelete({ roomNo });
};

const normalizeRoom = (room: IRoom): IRoom => {
  const occupantCount = room.occupants.length;
  room.occupancy = {
    current: occupantCount,
    available: Math.max(0, room.capacity - occupantCount),
  };

  if (room.status !== 'MAINTENANCE' && room.status !== 'RESERVED') {
    room.status = occupantCount === 0
      ? 'AVAILABLE'
      : occupantCount >= room.capacity ? 'FULL' : 'PARTIAL';
  }

  return room;
};

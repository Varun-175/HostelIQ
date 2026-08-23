import apiClient from './client';

/* ═══════════════════════════════════════════════
   TYPES — Match real backend Room model
   ═══════════════════════════════════════════════ */

export interface Room {
  _id: string;
  roomNo: number;
  block: string;
  floor: number;
  capacity: number;
  roomType: 'SINGLE' | 'DOUBLE' | 'TRIPLE';
  occupants: string[];
  occupancy?: {
    current: number;
    available: number;
  };
  status: 'AVAILABLE' | 'PARTIAL' | 'FULL' | 'MAINTENANCE' | 'RESERVED';
  facilities: string[];
  genderPolicy: 'MALE' | 'FEMALE' | 'COED' | 'ANY';
  utilizationScore?: number;
}

/* ═══════════════════════════════════════════════
   API CALLS
   ═══════════════════════════════════════════════ */

export const getRooms = async (): Promise<Room[]> => {
  const response = await apiClient.get('/rooms');
  return response.data.data;
};

export const getRoomByNo = async (roomNo: number): Promise<Room> => {
  const response = await apiClient.get(`/rooms/${roomNo}`);
  return response.data.data;
};

export const createRoom = async (data: Partial<Room>): Promise<Room> => {
  const response = await apiClient.post('/rooms', data);
  return response.data.data;
};

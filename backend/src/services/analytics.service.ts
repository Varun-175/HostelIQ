import { Room } from '../models/Room';
import { Student } from '../models/Student';

export const getAnalytics = async () => {
  const rooms = await Room.find();
  const studentsCount = await Student.countDocuments();

  let totalRooms = rooms.length;
  let occupiedRooms = 0;
  let availableRooms = 0;
  let totalCapacity = 0;
  let usedCapacity = 0;

  rooms.forEach(room => {
    totalCapacity += room.capacity;
    usedCapacity += room.occupants.length;

    if (room.occupants.length >= room.capacity) {
      occupiedRooms++;
    } else {
      availableRooms++; // Either fully empty or partially empty is "available" to allocate
    }
  });

  const utilization = totalCapacity > 0 ? ((usedCapacity / totalCapacity) * 100).toFixed(1) : '0.0';

  return {
    totalRooms,
    occupiedRooms,
    availableRooms,
    totalStudents: studentsCount,
    utilization: parseFloat(utilization),
  };
};

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Room } from './src/models/Room';
import { Allocation } from './src/models/Allocation';

dotenv.config();

const rooms = [
  // Floor 1 (Singles & Doubles)
  { roomNo: 101, floor: 1, capacity: 1, roomType: 'SINGLE' },
  { roomNo: 102, floor: 1, capacity: 1, roomType: 'SINGLE' },
  { roomNo: 103, floor: 1, capacity: 2, roomType: 'DOUBLE' },
  { roomNo: 104, floor: 1, capacity: 2, roomType: 'DOUBLE' },
  { roomNo: 105, floor: 1, capacity: 2, roomType: 'DOUBLE' },
  
  // Floor 2 (Doubles & Triples)
  { roomNo: 201, floor: 2, capacity: 2, roomType: 'DOUBLE' },
  { roomNo: 202, floor: 2, capacity: 2, roomType: 'DOUBLE' },
  { roomNo: 203, floor: 2, capacity: 3, roomType: 'TRIPLE' },
  { roomNo: 204, floor: 2, capacity: 3, roomType: 'TRIPLE' },
  { roomNo: 205, floor: 2, capacity: 3, roomType: 'TRIPLE' },

  // Floor 3 (Triples & Singles)
  { roomNo: 301, floor: 3, capacity: 3, roomType: 'TRIPLE' },
  { roomNo: 302, floor: 3, capacity: 3, roomType: 'TRIPLE' },
  { roomNo: 303, floor: 3, capacity: 1, roomType: 'SINGLE' },
  { roomNo: 304, floor: 3, capacity: 1, roomType: 'SINGLE' },
  { roomNo: 305, floor: 3, capacity: 1, roomType: 'SINGLE' },
  
  // Extra specific edge case rooms
  { roomNo: 401, floor: 4, capacity: 1, roomType: 'SINGLE' }, // Empty Single
  { roomNo: 402, floor: 4, capacity: 2, roomType: 'DOUBLE' }, // Will be seeded as partial? Or left empty for now.
];

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) throw new Error('MONGODB_URI missing in .env');

    await mongoose.connect(mongoUri);
    console.log('MongoDB Connected for Seeding');

    console.log('Clearing old Room and Allocation data...');
    // We do NOT clear students to prevent data loss
    await Room.deleteMany({});
    await Allocation.deleteMany({});

    console.log('Inserting Rooms...');
    await Room.insertMany(rooms);

    console.log(`Seeded ${rooms.length} rooms successfully!`);
    process.exit(0);
  } catch (error) {
    console.error('Seeding Error:', error);
    process.exit(1);
  }
};

seedData();

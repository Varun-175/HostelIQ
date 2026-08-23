import mongoose, { Document, Schema } from 'mongoose';

export interface IRoom extends Document {
  roomNo: number;
  block?: string;
  floor: number;
  capacity: number;
  roomType: 'SINGLE' | 'DOUBLE' | 'TRIPLE';
  occupants: mongoose.Types.ObjectId[];
  occupancy?: {
    current: number;
    available: number;
  };
  status?: 'AVAILABLE' | 'PARTIAL' | 'FULL' | 'MAINTENANCE' | 'RESERVED';
  facilities?: string[];
  genderPolicy?: 'MALE' | 'FEMALE' | 'COED' | 'ANY';
  utilizationScore?: number;
}

const roomSchema = new Schema<IRoom>(
  {
    roomNo: {
      type: Number,
      required: true,
      unique: true,
      index: true,
    },
    floor: {
      type: Number,
      required: true,
      index: true,
    },
    capacity: {
      type: Number,
      required: true,
      min: 1,
    },
    roomType: {
      type: String,
      enum: ['SINGLE', 'DOUBLE', 'TRIPLE'],
      required: true,
    },
    block: { type: String, default: 'A' },
    occupancy: {
      current: { type: Number, default: 0 },
      available: { type: Number, default: 0 },
    },
    status: {
      type: String,
      enum: ['AVAILABLE', 'PARTIAL', 'FULL', 'MAINTENANCE', 'RESERVED'],
      default: 'AVAILABLE',
    },
    facilities: [{ type: String }],
    genderPolicy: {
      type: String,
      enum: ['MALE', 'FEMALE', 'COED', 'ANY'],
      default: 'ANY',
    },
    utilizationScore: { type: Number, default: 0 },
    occupants: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Student',
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Indexes
roomSchema.index({ block: 1, roomNo: 1 }, { unique: true });

export const Room = mongoose.model<IRoom>('Room', roomSchema);

import mongoose, { Document, Schema } from 'mongoose';

export interface IStudent extends Document {
  registerNo: string;
  name: string;
  department: string;
  year: number;
  preferences: {
    roomType: 'SINGLE' | 'DOUBLE' | 'TRIPLE';
    floor?: number;
  };
  allocation?: {
    roomNo: number;
    score: number;
  };
  createdAt: Date;
}

const studentSchema = new Schema<IStudent>(
  {
    registerNo: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    department: {
      type: String,
      required: true,
    },
    year: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    preferences: {
      roomType: {
        type: String,
        enum: ['SINGLE', 'DOUBLE', 'TRIPLE'],
        required: true,
      },
      floor: {
        type: Number,
      },
    },
    allocation: {
      roomNo: {
        type: Number,
      },
      score: {
        type: Number,
      },
    },
  },
  {
    timestamps: true,
  }
);

export const Student = mongoose.model<IStudent>('Student', studentSchema);

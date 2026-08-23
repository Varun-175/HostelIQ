import mongoose, { Document, Schema } from 'mongoose';

export interface IStudent extends Document {
  registerNo: string;
  name: string;
  department: string;
  year: number;
  semester?: number;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  email?: string;
  phone?: string;
  academicProfile?: any;
  hostelProfile?: any;
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
    semester: { type: Number },
    gender: { type: String, enum: ['MALE', 'FEMALE', 'OTHER'] },
    email: { type: String },
    phone: { type: String },
    academicProfile: { type: Schema.Types.Mixed },
    hostelProfile: { type: Schema.Types.Mixed },
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

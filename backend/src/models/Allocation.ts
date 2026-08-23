import mongoose, { Document, Schema } from 'mongoose';

export interface IAllocation extends Document {
  studentId: mongoose.Types.ObjectId;
  roomNo: number;
  totalScore: number;
  scoreBreakdown: {
    roomType: number;
    floor: number;
    capacity: number;
    occupancy: number;
    fairness: number;
  };
  reason: string;
  allocatedAt: Date;
}

const allocationSchema = new Schema<IAllocation>(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
      index: true,
    },
    roomNo: {
      type: Number,
      required: true,
    },
    totalScore: {
      type: Number,
      required: true,
    },
    scoreBreakdown: {
      roomType: { type: Number, required: true },
      floor: { type: Number, required: true },
      capacity: { type: Number, required: true },
      occupancy: { type: Number, required: true },
      fairness: { type: Number, required: true },
    },
    reason: {
      type: String,
      required: true,
    },
    allocatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export const Allocation = mongoose.model<IAllocation>('Allocation', allocationSchema);

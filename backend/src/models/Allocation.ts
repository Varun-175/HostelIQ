import mongoose, { Document, Schema } from 'mongoose';

export interface IAllocation extends Document {
  studentId: mongoose.Types.ObjectId;
  roomId?: mongoose.Types.ObjectId;
  requestId?: mongoose.Types.ObjectId;
  status?: 'PENDING' | 'ALLOCATED' | 'CANCELLED';
  roomNo: number;
  totalScore: number;
  scoreBreakdown: {
    roomType: number;
    floor: number;
    capacity: number;
    occupancy: number;
    fairness: number;
  };
  smartFit?: {
    totalScore: number;
    rank: number;
    candidatesEvaluated: number;
  };
  reason: string;
  allocatedAt: Date;
  startsAt?: Date;
  endsAt?: Date;
  allocatedBy?: 'SYSTEM' | 'ADMIN';
  override?: boolean;
  overrideReason?: string;
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
    roomId: { type: Schema.Types.ObjectId, ref: 'Room' },
    requestId: { type: Schema.Types.ObjectId, ref: 'AllocationRequest' },
    status: {
      type: String,
      enum: ['PENDING', 'ALLOCATED', 'CANCELLED'],
      default: 'ALLOCATED',
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
    smartFit: {
      totalScore: { type: Number },
      rank: { type: Number },
      candidatesEvaluated: { type: Number },
    },
    reason: {
      type: String,
      required: true,
    },
    allocatedAt: {
      type: Date,
      default: Date.now,
    },
    startsAt: { type: Date, default: Date.now },
    endsAt: { type: Date, required: true, index: true },
    allocatedBy: {
      type: String,
      enum: ['SYSTEM', 'ADMIN'],
      default: 'SYSTEM',
    },
    override: { type: Boolean, default: false },
    overrideReason: { type: String },
  },
  {
    timestamps: true,
  }
);

export const Allocation = mongoose.model<IAllocation>('Allocation', allocationSchema);

import mongoose, { Schema, Document } from 'mongoose';

export interface IAllocationHistory extends Document {
  studentId: mongoose.Types.ObjectId;
  roomId: mongoose.Types.ObjectId;
  allocationId?: mongoose.Types.ObjectId;
  previousRoomId?: mongoose.Types.ObjectId;
  event: 'ALLOCATED' | 'TRANSFERRED' | 'CANCELLED' | 'REASSIGNED' | 'OVERRIDDEN' | 'VACATED';
  score?: number;
  scoreBreakdown?: any;
  reason?: string;
  actor: 'SYSTEM' | 'ADMIN' | 'STUDENT';
  createdAt: Date;
}

const AllocationHistorySchema = new Schema(
  {
    studentId: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
    roomId: { type: Schema.Types.ObjectId, ref: 'Room', required: true },
    allocationId: { type: Schema.Types.ObjectId, ref: 'Allocation' },
    previousRoomId: { type: Schema.Types.ObjectId, ref: 'Room' },
    event: {
      type: String,
      enum: ['ALLOCATED', 'TRANSFERRED', 'CANCELLED', 'REASSIGNED', 'OVERRIDDEN', 'VACATED'],
      required: true,
    },
    score: { type: Number },
    scoreBreakdown: { type: Schema.Types.Mixed },
    reason: { type: String },
    actor: {
      type: String,
      enum: ['SYSTEM', 'ADMIN', 'STUDENT'],
      required: true,
    },
    createdAt: { type: Date, default: Date.now },
  }
);

// Indexes
AllocationHistorySchema.index({ studentId: 1 });
AllocationHistorySchema.index({ roomId: 1 });
AllocationHistorySchema.index({ createdAt: -1 });

export const AllocationHistory = mongoose.model<IAllocationHistory>('AllocationHistory', AllocationHistorySchema);

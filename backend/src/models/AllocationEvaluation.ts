import mongoose, { Schema, Document } from 'mongoose';

export interface IAllocationEvaluation extends Document {
  requestId?: mongoose.Types.ObjectId;
  studentId: mongoose.Types.ObjectId;
  candidates: Array<{
    roomId: mongoose.Types.ObjectId;
    roomNo: number | string;
    eligible: boolean;
    rejectionReasons: string[];
    score: number;
    breakdown: {
      roomType: number;
      floor: number;
      capacity: number;
      occupancy: number;
      fairness: number;
    };
    rank: number;
  }>;
  selectedRoomId?: mongoose.Types.ObjectId;
  evaluatedAt: Date;
}

const AllocationEvaluationSchema = new Schema(
  {
    requestId: { type: Schema.Types.ObjectId, ref: 'AllocationRequest' },
    studentId: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
    candidates: [
      {
        roomId: { type: Schema.Types.ObjectId, ref: 'Room' },
        roomNo: { type: Schema.Types.Mixed }, // string or number
        eligible: { type: Boolean, required: true },
        rejectionReasons: [{ type: String }],
        score: { type: Number },
        breakdown: {
          roomType: { type: Number, default: 0 },
          floor: { type: Number, default: 0 },
          capacity: { type: Number, default: 0 },
          occupancy: { type: Number, default: 0 },
          fairness: { type: Number, default: 0 },
        },
        rank: { type: Number },
      }
    ],
    selectedRoomId: { type: Schema.Types.ObjectId, ref: 'Room' },
    evaluatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true } // automatically adds createdAt and updatedAt
);

// Indexes
AllocationEvaluationSchema.index({ studentId: 1 });
AllocationEvaluationSchema.index({ requestId: 1 });
AllocationEvaluationSchema.index({ evaluatedAt: -1 });

export const AllocationEvaluation = mongoose.model<IAllocationEvaluation>('AllocationEvaluation', AllocationEvaluationSchema);

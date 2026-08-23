import mongoose, { Schema, Document } from 'mongoose';

export interface IAllocationRequest extends Document {
  studentId: mongoose.Types.ObjectId;
  preferences: {
    roomType?: string;
    preferredFloor?: number;
    preferredBlock?: string;
    roommatePreference?: string;
  };
  constraints: {
    genderCompatibility?: string;
    accessibility?: boolean;
    maxOccupancy?: number;
  };
  priority: number;
  status: 'PENDING' | 'EVALUATING' | 'ALLOCATED' | 'REVIEW_REQUIRED' | 'FAILED' | 'CANCELLED';
  requestedAt: Date;
  processedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const AllocationRequestSchema = new Schema(
  {
    studentId: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
    preferences: {
      roomType: { type: String, enum: ['SINGLE', 'DOUBLE', 'TRIPLE'] },
      preferredFloor: { type: Number },
      preferredBlock: { type: String },
      roommatePreference: { type: String },
    },
    constraints: {
      genderCompatibility: { type: String, enum: ['MALE', 'FEMALE', 'COED', 'ANY'], default: 'ANY' },
      accessibility: { type: Boolean, default: false },
      maxOccupancy: { type: Number },
    },
    priority: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['PENDING', 'EVALUATING', 'ALLOCATED', 'REVIEW_REQUIRED', 'FAILED', 'CANCELLED'],
      default: 'PENDING',
    },
    requestedAt: { type: Date, default: Date.now },
    processedAt: { type: Date },
  },
  { timestamps: true }
);

// Indexes
AllocationRequestSchema.index({ studentId: 1 });
AllocationRequestSchema.index({ status: 1 });
AllocationRequestSchema.index({ createdAt: -1 });

export const AllocationRequest = mongoose.model<IAllocationRequest>('AllocationRequest', AllocationRequestSchema);

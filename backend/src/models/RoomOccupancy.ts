import mongoose, { Schema, Document } from 'mongoose';

export interface IRoomOccupancy extends Document {
  roomId: mongoose.Types.ObjectId;
  studentId: mongoose.Types.ObjectId;
  allocationId?: mongoose.Types.ObjectId;
  bedNumber?: number;
  checkIn?: Date;
  checkOut?: Date;
  status: 'ACTIVE' | 'ENDED';
  createdAt: Date;
  updatedAt: Date;
}

const RoomOccupancySchema = new Schema(
  {
    roomId: { type: Schema.Types.ObjectId, ref: 'Room', required: true },
    studentId: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
    allocationId: { type: Schema.Types.ObjectId, ref: 'Allocation' },
    bedNumber: { type: Number },
    checkIn: { type: Date },
    checkOut: { type: Date },
    status: {
      type: String,
      enum: ['ACTIVE', 'ENDED'],
      default: 'ACTIVE',
    },
  },
  { timestamps: true }
);

// Indexes
RoomOccupancySchema.index({ roomId: 1 });
RoomOccupancySchema.index({ studentId: 1 });
RoomOccupancySchema.index({ status: 1 });

export const RoomOccupancy = mongoose.model<IRoomOccupancy>('RoomOccupancy', RoomOccupancySchema);

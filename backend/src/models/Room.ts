import mongoose, { Document, Schema } from 'mongoose';

export interface IRoom extends Document {
  roomNo: number;
  floor: number;
  capacity: number;
  roomType: 'SINGLE' | 'DOUBLE' | 'TRIPLE';
  occupants: mongoose.Types.ObjectId[];
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

export const Room = mongoose.model<IRoom>('Room', roomSchema);

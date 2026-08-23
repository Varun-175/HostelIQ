import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  name: string;
  role: 'STUDENT' | 'WARDEN' | 'HOSTEL_ADMIN' | 'SUPER_ADMIN';
  permissions: string[];
  passwordHash?: string;
  referenceId?: mongoose.Types.ObjectId; // E.g., Student ID if role is STUDENT
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    role: {
      type: String,
      enum: ['STUDENT', 'WARDEN', 'HOSTEL_ADMIN', 'SUPER_ADMIN'],
      default: 'STUDENT',
    },
    permissions: [{ type: String }],
    passwordHash: { type: String, select: false },
    referenceId: { type: Schema.Types.ObjectId },
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>('User', UserSchema);

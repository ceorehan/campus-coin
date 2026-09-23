import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  academicYear: string;
  monthlyAllowanceBaseline: number;
  savingsGoal: number;
  role: 'student' | 'admin';
  isActive: boolean;
  currency: string;
  themePreference: 'light' | 'dark' | 'system';
  fontSize: 'normal' | 'large';
  notificationsEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 6,
      select: false,
    },
    academicYear: {
      type: String,
      default: 'Sophomore',
    },
    monthlyAllowanceBaseline: {
      type: Number,
      default: 50000,
    },
    savingsGoal: {
      type: Number,
      default: 15000,
    },
    role: {
      type: String,
      enum: ['student', 'admin'],
      default: 'student',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    currency: {
      type: String,
      default: 'USD',
    },
    themePreference: {
      type: String,
      enum: ['light', 'dark', 'system'],
      default: 'light',
    },
    fontSize: {
      type: String,
      enum: ['normal', 'large'],
      default: 'normal',
    },
    notificationsEnabled: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model<IUser>('User', UserSchema);

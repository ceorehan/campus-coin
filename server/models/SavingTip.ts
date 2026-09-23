import mongoose, { Document, Schema } from 'mongoose';

export interface ISavingTip extends Document {
  title: string;
  description: string;
  category: string;
  potentialSavingImpact: number;
  priority: number;
  isSystemTip: boolean;
  isActive: boolean;
  createdAt: Date;
}

const SavingTipSchema = new Schema<ISavingTip>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      default: 'General',
    },
    potentialSavingImpact: {
      type: Number,
      default: 0,
    },
    priority: {
      type: Number,
      default: 1,
    },
    isSystemTip: {
      type: Boolean,
      default: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

export const SavingTip = mongoose.model<ISavingTip>('SavingTip', SavingTipSchema);

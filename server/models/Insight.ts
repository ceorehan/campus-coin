import mongoose, { Document, Schema } from 'mongoose';

export interface IInsight extends Document {
  userId: mongoose.Types.ObjectId;
  month: string;
  summaryText: string;
  tipText: string;
  topCategory?: string;
  spendingChangePct?: number;
  totalSpent?: number;
  generatedAt: Date;
}

const InsightSchema = new Schema<IInsight>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    month: {
      type: String,
      required: true,
    },
    summaryText: {
      type: String,
      required: true,
    },
    tipText: {
      type: String,
      required: true,
    },
    topCategory: {
      type: String,
      default: '',
    },
    spendingChangePct: {
      type: Number,
      default: 0,
    },
    totalSpent: {
      type: Number,
      default: 0,
    },
    generatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

InsightSchema.index({ userId: 1, month: -1 });

export const Insight = mongoose.model<IInsight>('Insight', InsightSchema);

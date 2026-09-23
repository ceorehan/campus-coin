import mongoose, { Document, Schema } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  type: 'income' | 'expense';
  userId: mongoose.Types.ObjectId | null;
  isDefault: boolean;
  color?: string;
  icon?: string;
  createdAt: Date;
}

const CategorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: [true, 'Please provide category name'],
      trim: true,
    },
    type: {
      type: String,
      enum: ['income', 'expense'],
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
    color: {
      type: String,
      default: '#4f46e5',
    },
    icon: {
      type: String,
      default: 'tag',
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

CategorySchema.index({ userId: 1, name: 1, type: 1 });

export const Category = mongoose.model<ICategory>('Category', CategorySchema);

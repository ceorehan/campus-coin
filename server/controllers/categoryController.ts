import { Response } from 'express';
import mongoose from 'mongoose';
import { AuthRequest } from '../middleware/authMiddleware.js';
import { Category } from '../models/Category.js';
import { suggestCategory } from '../services/aiService.js';

// @desc    Get all categories for user (defaults + user custom)
// @route   GET /api/categories
export const getCategories = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!._id;
    const { type } = req.query;

    const query: any = {
      $or: [{ isDefault: true }, { userId }],
    };

    if (type && (type === 'income' || type === 'expense')) {
      query.type = type;
    }

    const categories = await Category.find(query).sort({ isDefault: -1, name: 1 });

    return res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create student custom category
// @route   POST /api/categories
export const createCategory = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!._id;
    const { name, type, color, icon } = req.body;

    if (!name || !type) {
      return res.status(400).json({
        success: false,
        message: 'Category name and type (income/expense) are required',
      });
    }

    // Check existing
    const existing = await Category.findOne({
      name: { $regex: new RegExp(`^${name.trim()}$`, 'i') },
      type,
      $or: [{ isDefault: true }, { userId }],
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'A category with this name already exists',
      });
    }

    const category = await Category.create({
      name: name.trim(),
      type,
      userId,
      isDefault: false,
      color: color || '#6366f1',
      icon: icon || 'tag',
    });

    return res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: category,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update custom category
// @route   PUT /api/categories/:id
export const updateCategory = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!._id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid category ID' });
    }

    const category = await Category.findOne({ _id: id, userId });
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found or cannot edit default system category',
      });
    }

    const { name, color, icon } = req.body;
    if (name) category.name = name.trim();
    if (color) category.color = color;
    if (icon) category.icon = icon;

    await category.save();

    return res.status(200).json({
      success: true,
      message: 'Category updated successfully',
      data: category,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete custom category
// @route   DELETE /api/categories/:id
export const deleteCategory = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!._id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid category ID' });
    }

    const category = await Category.findOneAndDelete({ _id: id, userId });
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found or default system categories cannot be deleted',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Category deleted successfully',
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    AI Category Suggestion
// @route   POST /api/categories/suggest
export const suggestAICategory = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!._id;
    const { description, type = 'expense' } = req.body;

    if (!description) {
      return res.status(400).json({
        success: false,
        message: 'Description is required for AI category suggestion',
      });
    }

    // Get active categories for this user and type
    const categories = await Category.find({
      type,
      $or: [{ isDefault: true }, { userId }],
    });

    const categoryNames = categories.map((c) => c.name);
    const suggestion = await suggestCategory(description, categoryNames, type);

    const matchedCategory = categories.find(
      (c) => c.name.toLowerCase() === suggestion.category.toLowerCase()
    );

    return res.status(200).json({
      success: true,
      data: {
        category: suggestion.category,
        categoryId: matchedCategory ? matchedCategory._id : null,
        confidence: suggestion.confidence,
        source: suggestion.source,
      },
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'AI suggestion unavailable. Please select a category manually.',
    });
  }
};

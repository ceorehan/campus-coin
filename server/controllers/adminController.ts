import { Response } from 'express';
import mongoose from 'mongoose';
import { AuthRequest } from '../middleware/authMiddleware.js';
import { User } from '../models/User.js';
import { Transaction } from '../models/Transaction.js';
import { Category } from '../models/Category.js';
import { SavingTip } from '../models/SavingTip.js';
import { Announcement } from '../models/Announcement.js';

// @desc    Get all users for admin with search & pagination
// @route   GET /api/admin/users
export const getUsers = async (req: AuthRequest, res: Response) => {
  try {
    const { search, role, page = 1, limit = 15 } = req.query;

    const query: any = {};
    if (role && (role === 'student' || role === 'admin')) {
      query.role = role;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search as string, $options: 'i' } },
        { email: { $regex: search as string, $options: 'i' } },
      ];
    }

    const pageNum = Math.max(1, parseInt(page as string, 10));
    const limitNum = Math.max(1, parseInt(limit as string, 10));
    const skip = (pageNum - 1) * limitNum;

    const [users, total] = await Promise.all([
      User.find(query).select('-password').sort({ createdAt: -1 }).skip(skip).limit(limitNum),
      User.countDocuments(query),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        users,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(total / limitNum),
        },
      },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Toggle user status (Enable / Disable)
// @route   PUT /api/admin/users/:id/status
export const updateUserStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid user ID' });
    }

    // Prevent admin from disabling themselves
    if (id === req.user!._id.toString()) {
      return res.status(400).json({ success: false, message: 'Cannot disable your own admin account' });
    }

    const user = await User.findById(id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.isActive = isActive !== undefined ? Boolean(isActive) : !user.isActive;
    await user.save();

    return res.status(200).json({
      success: true,
      message: `User has been ${user.isActive ? 'enabled' : 'disabled'} successfully.`,
      data: user,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get admin categories (Default system categories)
// @route   GET /api/admin/categories
export const getAdminCategories = async (req: AuthRequest, res: Response) => {
  try {
    const categories = await Category.find({ isDefault: true }).sort({ type: 1, name: 1 });
    return res.status(200).json({ success: true, data: categories });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create default system category
// @route   POST /api/admin/categories
export const createAdminCategory = async (req: AuthRequest, res: Response) => {
  try {
    const { name, type, color, icon } = req.body;

    if (!name || !type) {
      return res.status(400).json({ success: false, message: 'Name and type are required' });
    }

    const existing = await Category.findOne({
      name: { $regex: new RegExp(`^${name.trim()}$`, 'i') },
      type,
      isDefault: true,
    });

    if (existing) {
      return res.status(409).json({ success: false, message: 'Default category already exists' });
    }

    const category = await Category.create({
      name: name.trim(),
      type,
      isDefault: true,
      userId: null,
      color: color || '#4f46e5',
      icon: icon || 'tag',
    });

    return res.status(201).json({
      success: true,
      message: 'Default category created successfully',
      data: category,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update default system category
// @route   PUT /api/admin/categories/:id
export const updateAdminCategory = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, color, icon } = req.body;

    const category = await Category.findOne({ _id: id, isDefault: true });
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    if (name) category.name = name.trim();
    if (color) category.color = color;
    if (icon) category.icon = icon;

    await category.save();

    return res.status(200).json({
      success: true,
      message: 'Default category updated successfully',
      data: category,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete default category
// @route   DELETE /api/admin/categories/:id
export const deleteAdminCategory = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const category = await Category.findOneAndDelete({ _id: id, isDefault: true });
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    return res.status(200).json({
      success: true,
      message: 'Default category deleted successfully',
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get admin saving tips
// @route   GET /api/admin/tips
export const getAdminTips = async (req: AuthRequest, res: Response) => {
  try {
    const tips = await SavingTip.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, data: tips });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create system saving tip
// @route   POST /api/admin/tips
export const createAdminTip = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, category, potentialSavingImpact, priority, isActive } = req.body;

    if (!title || !description) {
      return res.status(400).json({ success: false, message: 'Title and description are required' });
    }

    const tip = await SavingTip.create({
      title,
      description,
      category: category || 'General',
      potentialSavingImpact: potentialSavingImpact ? Number(potentialSavingImpact) : 0,
      priority: priority ? Number(priority) : 1,
      isSystemTip: true,
      isActive: isActive !== undefined ? Boolean(isActive) : true,
    });

    return res.status(201).json({
      success: true,
      message: 'Saving tip created successfully',
      data: tip,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update saving tip
// @route   PUT /api/admin/tips/:id
export const updateAdminTip = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, category, potentialSavingImpact, priority, isActive } = req.body;

    const tip = await SavingTip.findById(id);
    if (!tip) {
      return res.status(404).json({ success: false, message: 'Tip not found' });
    }

    if (title) tip.title = title;
    if (description) tip.description = description;
    if (category) tip.category = category;
    if (potentialSavingImpact !== undefined) tip.potentialSavingImpact = Number(potentialSavingImpact);
    if (priority !== undefined) tip.priority = Number(priority);
    if (isActive !== undefined) tip.isActive = Boolean(isActive);

    await tip.save();

    return res.status(200).json({
      success: true,
      message: 'Tip updated successfully',
      data: tip,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete saving tip
// @route   DELETE /api/admin/tips/:id
export const deleteAdminTip = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    await SavingTip.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: 'Tip deleted successfully',
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get announcements
// @route   GET /api/admin/announcements
export const getAdminAnnouncements = async (req: AuthRequest, res: Response) => {
  try {
    const announcements = await Announcement.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, data: announcements });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create announcement
// @route   POST /api/admin/announcements
export const createAdminAnnouncement = async (req: AuthRequest, res: Response) => {
  try {
    const { title, message, startDate, endDate, status } = req.body;

    if (!title || !message || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'Title, message, and end date are required',
      });
    }

    const announcement = await Announcement.create({
      title,
      message,
      startDate: startDate ? new Date(startDate) : new Date(),
      endDate: new Date(endDate),
      status: status || 'active',
      createdBy: req.user!._id,
    });

    return res.status(201).json({
      success: true,
      message: 'Announcement published successfully',
      data: announcement,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update announcement
// @route   PUT /api/admin/announcements/:id
export const updateAdminAnnouncement = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { title, message, startDate, endDate, status } = req.body;

    const announcement = await Announcement.findById(id);
    if (!announcement) {
      return res.status(404).json({ success: false, message: 'Announcement not found' });
    }

    if (title) announcement.title = title;
    if (message) announcement.message = message;
    if (startDate) announcement.startDate = new Date(startDate);
    if (endDate) announcement.endDate = new Date(endDate);
    if (status) announcement.status = status;

    await announcement.save();

    return res.status(200).json({
      success: true,
      message: 'Announcement updated successfully',
      data: announcement,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete announcement
// @route   DELETE /api/admin/announcements/:id
export const deleteAdminAnnouncement = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    await Announcement.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: 'Announcement deleted successfully',
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get admin high-level system statistics
// @route   GET /api/admin/statistics
export const getAdminStatistics = async (req: AuthRequest, res: Response) => {
  try {
    const [totalUsers, activeUsers, totalTransactions, transactionAgg, topCategoriesAgg] =
      await Promise.all([
        User.countDocuments({ role: 'student' }),
        User.countDocuments({ role: 'student', isActive: true }),
        Transaction.countDocuments(),
        Transaction.aggregate([
          {
            $group: {
              _id: '$type',
              total: { $sum: '$amount' },
            },
          },
        ]),
        Transaction.aggregate([
          {
            $group: {
              _id: '$categoryId',
              totalAmount: { $sum: '$amount' },
              count: { $sum: 1 },
            },
          },
          {
            $lookup: {
              from: 'categories',
              localField: '_id',
              foreignField: '_id',
              as: 'category',
            },
          },
          { $unwind: '$category' },
          { $sort: { count: -1 } },
          { $limit: 5 },
          {
            $project: {
              _id: 1,
              name: '$category.name',
              type: '$category.type',
              count: 1,
              totalAmount: 1,
            },
          },
        ]),
      ]);

    let totalIncome = 0;
    let totalExpenses = 0;
    for (const t of transactionAgg) {
      if (t._id === 'income') totalIncome = t.total;
      if (t._id === 'expense') totalExpenses = t.total;
    }

    const recentUsers = await User.find({ role: 'student' })
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(5);

    return res.status(200).json({
      success: true,
      data: {
        totalUsers,
        activeUsers,
        inactiveUsers: totalUsers - activeUsers,
        totalTransactions,
        totalIncome,
        totalExpenses,
        netFlow: totalIncome - totalExpenses,
        mostUsedCategory: topCategoriesAgg[0]?.name || 'None',
        topCategories: topCategoriesAgg,
        recentUsers,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

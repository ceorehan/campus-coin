import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware.js';
import { User } from '../models/User.js';
import { Transaction } from '../models/Transaction.js';
import { comparePassword, hashPassword } from '../utils/password.js';

// @desc    Get user profile with overview stats
// @route   GET /api/users/profile
export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user!._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Lifetime statistics
    const stats = await Transaction.aggregate([
      { $match: { userId: user._id } },
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
    ]);

    let totalIncome = 0;
    let totalExpenses = 0;
    let totalTransactions = 0;

    for (const item of stats) {
      if (item._id === 'income') totalIncome = item.total;
      if (item._id === 'expense') totalExpenses = item.total;
      totalTransactions += item.count;
    }

    const totalSavings = totalIncome - totalExpenses;

    return res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          academicYear: user.academicYear,
          monthlyAllowanceBaseline: user.monthlyAllowanceBaseline,
          savingsGoal: user.savingsGoal,
          currency: user.currency,
          themePreference: user.themePreference,
          fontSize: user.fontSize,
          notificationsEnabled: user.notificationsEnabled,
          createdAt: user.createdAt,
        },
        statistics: {
          totalTransactions,
          totalIncome,
          totalExpenses,
          totalSavings,
        },
      },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Change user password
// @route   PUT /api/users/change-password
export const changePassword = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user!._id).select('+password');
    if (!user || !user.password) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Please provide current and new password' });
    }

    const isMatch = await comparePassword(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect' });
    }

    user.password = await hashPassword(newPassword);
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Password successfully changed',
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @route   PUT /api/users/profile
export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user!._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const {
      name,
      academicYear,
      monthlyAllowanceBaseline,
      savingsGoal,
      currency,
      themePreference,
      fontSize,
      notificationsEnabled,
    } = req.body;

    if (name !== undefined) user.name = name;
    if (academicYear !== undefined) user.academicYear = academicYear;
    if (monthlyAllowanceBaseline !== undefined) user.monthlyAllowanceBaseline = Number(monthlyAllowanceBaseline);
    if (savingsGoal !== undefined) user.savingsGoal = Number(savingsGoal);
    if (currency !== undefined) user.currency = currency;
    if (themePreference !== undefined) user.themePreference = themePreference;
    if (fontSize !== undefined) user.fontSize = fontSize;
    if (notificationsEnabled !== undefined) user.notificationsEnabled = Boolean(notificationsEnabled);

    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: user,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

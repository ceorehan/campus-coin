import { Response } from 'express';
import mongoose from 'mongoose';
import { AuthRequest } from '../middleware/authMiddleware.js';
import { Budget } from '../models/Budget.js';
import { Category } from '../models/Category.js';
import { Transaction } from '../models/Transaction.js';
import { checkBudgetThresholds } from '../services/notificationService.js';

// @desc    Get all budgets for a given month with spent and usage status
// @route   GET /api/budgets
export const getBudgets = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!._id;
    const now = new Date();
    const currentMonth = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}`;
    const month = (req.query.month as string) || currentMonth;

    const [yearStr, monthStr] = month.split('-');
    const year = parseInt(yearStr, 10);
    const monthNum = parseInt(monthStr, 10);

    const startOfMonth = new Date(Date.UTC(year, monthNum - 1, 1, 0, 0, 0));
    const endOfMonth = new Date(Date.UTC(year, monthNum, 0, 23, 59, 59, 999));

    // Get all budgets for user in this month
    const budgets = await Budget.find({ userId, month })
      .populate('categoryId', 'name type color icon')
      .sort({ createdAt: -1 });

    // Aggregate spending per category for this month
    const categorySpending = await Transaction.aggregate([
      {
        $match: {
          userId,
          type: 'expense',
          date: { $gte: startOfMonth, $lte: endOfMonth },
        },
      },
      {
        $group: {
          _id: '$categoryId',
          total: { $sum: '$amount' },
        },
      },
    ]);

    const spendingMap: Record<string, number> = {};
    for (const c of categorySpending) {
      spendingMap[c._id.toString()] = c.total;
    }

    let totalBudget = 0;
    let totalSpent = 0;

    const budgetDetails = budgets.map((b) => {
      const catId = (b.categoryId as any)._id.toString();
      const spent = spendingMap[catId] || 0;
      const remaining = Math.max(0, b.limitAmount - spent);
      const usage = Math.round((spent / b.limitAmount) * 100);

      let status: 'Safe' | 'Near Limit' | 'Exceeded' = 'Safe';
      if (usage >= 100) status = 'Exceeded';
      else if (usage >= 75) status = 'Near Limit';

      totalBudget += b.limitAmount;
      totalSpent += spent;

      return {
        _id: b._id,
        category: b.categoryId,
        month: b.month,
        limitAmount: b.limitAmount,
        spent,
        remaining,
        usage,
        status,
        createdAt: b.createdAt,
      };
    });

    const overallUsage = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0;

    return res.status(200).json({
      success: true,
      data: {
        month,
        totalBudget,
        totalSpent,
        totalRemaining: Math.max(0, totalBudget - totalSpent),
        overallUsage,
        budgets: budgetDetails,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a new budget
// @route   POST /api/budgets
export const createBudget = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!._id;
    const { categoryId, month, limitAmount } = req.body;

    if (!categoryId || !limitAmount) {
      return res.status(400).json({
        success: false,
        message: 'Please provide category and budget limit amount',
      });
    }

    const now = new Date();
    const currentMonth = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}`;
    const targetMonth = month || currentMonth;

    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    // Check if budget already exists for this category and month
    let budget = await Budget.findOne({ userId, categoryId, month: targetMonth });

    if (budget) {
      budget.limitAmount = Number(limitAmount);
      await budget.save();
    } else {
      budget = await Budget.create({
        userId,
        categoryId,
        month: targetMonth,
        limitAmount: Number(limitAmount),
      });
    }

    // Check thresholds immediately
    await checkBudgetThresholds(userId, new mongoose.Types.ObjectId(categoryId), new Date());

    const populated = await Budget.findById(budget._id).populate('categoryId', 'name type color icon');

    return res.status(201).json({
      success: true,
      message: 'Budget saved successfully',
      data: populated,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update an existing budget
// @route   PUT /api/budgets/:id
export const updateBudget = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!._id;
    const { limitAmount } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid budget ID' });
    }

    const budget = await Budget.findOne({ _id: id, userId });
    if (!budget) {
      return res.status(404).json({ success: false, message: 'Budget not found' });
    }

    if (limitAmount !== undefined) {
      budget.limitAmount = Number(limitAmount);
      await budget.save();
    }

    await checkBudgetThresholds(userId, budget.categoryId, new Date());

    const populated = await Budget.findById(budget._id).populate('categoryId', 'name type color icon');

    return res.status(200).json({
      success: true,
      message: 'Budget updated successfully',
      data: populated,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a budget
// @route   DELETE /api/budgets/:id
export const deleteBudget = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!._id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid budget ID' });
    }

    const budget = await Budget.findOneAndDelete({ _id: id, userId });
    if (!budget) {
      return res.status(404).json({ success: false, message: 'Budget not found' });
    }

    return res.status(200).json({
      success: true,
      message: 'Budget removed successfully',
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

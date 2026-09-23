import { Response } from 'express';
import mongoose from 'mongoose';
import { AuthRequest } from '../middleware/authMiddleware.js';
import { Transaction } from '../models/Transaction.js';
import { Category } from '../models/Category.js';
import { Budget } from '../models/Budget.js';
import { Announcement } from '../models/Announcement.js';
import { Insight } from '../models/Insight.js';
import { checkBudgetThresholds, processRecurringTransactions } from '../services/notificationService.js';
import { getSixMonthTrend } from '../services/reportService.js';
import { getPersonalizedTips } from '../services/savingTipService.js';

// @desc    Get transactions with filtering, search, pagination
// @route   GET /api/transactions
export const getTransactions = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!._id;
    const {
      search,
      type,
      categoryId,
      startDate,
      endDate,
      page = 1,
      limit = 10,
      sortBy = 'date',
      sortOrder = 'desc',
    } = req.query;

    const query: any = { userId };

    if (type && (type === 'income' || type === 'expense')) {
      query.type = type;
    }

    if (categoryId && mongoose.Types.ObjectId.isValid(categoryId as string)) {
      query.categoryId = new mongoose.Types.ObjectId(categoryId as string);
    }

    if (search) {
      query.description = { $regex: search as string, $options: 'i' };
    }

    if (startDate || endDate) {
      query.date = {};
      if (startDate) {
        query.date.$gte = new Date(startDate as string);
      }
      if (endDate) {
        const end = new Date(endDate as string);
        end.setHours(23, 59, 59, 999);
        query.date.$lte = end;
      }
    }

    const pageNum = Math.max(1, parseInt(page as string, 10));
    const limitNum = Math.max(1, Math.min(100, parseInt(limit as string, 10)));
    const skip = (pageNum - 1) * limitNum;

    const sortOption: any = {};
    sortOption[sortBy as string] = sortOrder === 'asc' ? 1 : -1;

    const [transactions, total] = await Promise.all([
      Transaction.find(query)
        .populate('categoryId', 'name type color icon')
        .populate('aiSuggestedCategoryId', 'name')
        .sort(sortOption)
        .skip(skip)
        .limit(limitNum),
      Transaction.countDocuments(query),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        transactions,
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

// @desc    Get single transaction by ID
// @route   GET /api/transactions/:id
export const getTransactionById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid transaction ID' });
    }

    const transaction = await Transaction.findOne({ _id: id, userId: req.user!._id })
      .populate('categoryId', 'name type color icon')
      .populate('aiSuggestedCategoryId', 'name');

    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }

    return res.status(200).json({ success: true, data: transaction });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new transaction
// @route   POST /api/transactions
export const createTransaction = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!._id;
    const { categoryId, amount, type, description, date, isRecurring, recurringFrequency, aiSuggestedCategoryId } = req.body;

    if (!categoryId || !amount || !type || !description) {
      return res.status(400).json({
        success: false,
        message: 'Please provide category, amount, type, and description',
      });
    }

    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Selected category does not exist' });
    }

    const parsedDate = date ? new Date(date) : new Date();

    const transaction = await Transaction.create({
      userId,
      categoryId,
      amount: Math.abs(Number(amount)),
      type,
      description,
      date: parsedDate,
      isRecurring: Boolean(isRecurring),
      recurringFrequency: recurringFrequency || 'none',
      aiSuggestedCategoryId: aiSuggestedCategoryId || null,
    });

    // Run budget checks in background
    if (type === 'expense') {
      await checkBudgetThresholds(userId, new mongoose.Types.ObjectId(categoryId), parsedDate);
    }

    const populated = await Transaction.findById(transaction._id)
      .populate('categoryId', 'name type color icon')
      .populate('aiSuggestedCategoryId', 'name');

    return res.status(201).json({
      success: true,
      message: 'Transaction created successfully.',
      data: populated,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update transaction
// @route   PUT /api/transactions/:id
export const updateTransaction = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!._id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid transaction ID' });
    }

    const transaction = await Transaction.findOne({ _id: id, userId });
    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Transaction not found or unauthorized' });
    }

    const { categoryId, amount, type, description, date, isRecurring, recurringFrequency } = req.body;

    if (categoryId) transaction.categoryId = categoryId;
    if (amount !== undefined) transaction.amount = Math.abs(Number(amount));
    if (type) transaction.type = type;
    if (description) transaction.description = description;
    if (date) transaction.date = new Date(date);
    if (isRecurring !== undefined) transaction.isRecurring = Boolean(isRecurring);
    if (recurringFrequency) transaction.recurringFrequency = recurringFrequency;

    await transaction.save();

    if (transaction.type === 'expense') {
      await checkBudgetThresholds(userId, transaction.categoryId, transaction.date);
    }

    const updated = await Transaction.findById(transaction._id)
      .populate('categoryId', 'name type color icon')
      .populate('aiSuggestedCategoryId', 'name');

    return res.status(200).json({
      success: true,
      message: 'Transaction updated successfully.',
      data: updated,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete transaction
// @route   DELETE /api/transactions/:id
export const deleteTransaction = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!._id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid transaction ID' });
    }

    const transaction = await Transaction.findOneAndDelete({ _id: id, userId });
    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Transaction not found or unauthorized' });
    }

    return res.status(200).json({
      success: true,
      message: 'Transaction deleted successfully.',
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get complete student dashboard summary
// @route   GET /api/transactions/dashboard/summary
export const getDashboardSummary = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!._id;
    const user = req.user!;
    const now = new Date();
    const currentMonth = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}`;
    const startOfMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
    const endOfMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 0, 23, 59, 59));

    // Also process any recurring transactions due
    await processRecurringTransactions();

    // 1. Current Month Totals
    const monthTotals = await Transaction.aggregate([
      {
        $match: {
          userId,
          date: { $gte: startOfMonth, $lte: endOfMonth },
        },
      },
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' },
        },
      },
    ]);

    let currentIncome = 0;
    let currentExpense = 0;
    for (const item of monthTotals) {
      if (item._id === 'income') currentIncome = item.total;
      if (item._id === 'expense') currentExpense = item.total;
    }

    const currentBalance = currentIncome - currentExpense;
    const currentSavings = currentBalance;
    const savingsRate = currentIncome > 0 ? Math.round((currentSavings / currentIncome) * 100) : 0;
    const savingsGoal = user.savingsGoal || 15000;
    const savingsGoalProgress = Math.min(100, Math.max(0, Math.round((currentSavings / savingsGoal) * 100)));

    // 2. All-Time Balance
    const lifetimeTotals = await Transaction.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' },
        },
      },
    ]);
    let lifetimeIncome = 0;
    let lifetimeExpense = 0;
    for (const item of lifetimeTotals) {
      if (item._id === 'income') lifetimeIncome = item.total;
      if (item._id === 'expense') lifetimeExpense = item.total;
    }
    const lifetimeBalance = lifetimeIncome - lifetimeExpense;

    // 3. Category Spending Breakdown for current month
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
      {
        $project: {
          _id: 1,
          name: '$category.name',
          color: '$category.color',
          icon: '$category.icon',
          total: 1,
          count: 1,
        },
      },
      { $sort: { total: -1 } },
    ]);

    const totalExpenseInBreakdown = categorySpending.reduce((acc, c) => acc + c.total, 0);
    const categoryChartData = categorySpending.map((c) => ({
      name: c.name,
      value: c.total,
      color: c.color,
      icon: c.icon,
      percentage: totalExpenseInBreakdown > 0 ? Math.round((c.total / totalExpenseInBreakdown) * 100) : 0,
    }));

    const topCategory = categoryChartData[0] || null;

    // 4. Six-Month Trend
    const sixMonthTrend = await getSixMonthTrend(userId);

    // 5. Recent 6 Transactions
    const recentTransactions = await Transaction.find({ userId })
      .populate('categoryId', 'name type color icon')
      .sort({ date: -1, createdAt: -1 })
      .limit(6);

    // 6. Budgets vs Actual for Current Month
    const budgets = await Budget.find({ userId, month: currentMonth }).populate('categoryId', 'name color icon');
    const budgetVsActual = [];
    const budgetAlerts = [];

    for (const b of budgets) {
      const catId = (b.categoryId as any)._id;
      const spentItem = categorySpending.find((c) => c._id.toString() === catId.toString());
      const spent = spentItem ? spentItem.total : 0;
      const usage = Math.round((spent / b.limitAmount) * 100);
      const remaining = Math.max(0, b.limitAmount - spent);

      let status: 'Safe' | 'Near Limit' | 'Exceeded' = 'Safe';
      if (usage >= 100) status = 'Exceeded';
      else if (usage >= 75) status = 'Near Limit';

      const entry = {
        budgetId: b._id,
        category: (b.categoryId as any).name,
        color: (b.categoryId as any).color,
        limitAmount: b.limitAmount,
        spent,
        remaining,
        usage,
        status,
      };

      budgetVsActual.push(entry);

      if (status !== 'Safe') {
        budgetAlerts.push(entry);
      }
    }

    // 7. Active Announcements
    const announcements = await Announcement.find({
      status: 'active',
      startDate: { $lte: now },
      endDate: { $gte: now },
    }).sort({ createdAt: -1 }).limit(3);

    // 8. Saving Tips
    const savingTips = (await getPersonalizedTips(userId)).slice(0, 3);

    // 9. Latest Monthly Insight
    const latestInsight = await Insight.findOne({ userId }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: {
        cards: {
          totalBalance: lifetimeBalance,
          monthlyBalance: currentBalance,
          totalIncome: currentIncome,
          totalExpenses: currentExpense,
          totalSavings: currentSavings,
          savingsRate,
          savingsGoal,
          savingsGoalProgress,
          monthlyAllowanceBaseline: user.monthlyAllowanceBaseline,
        },
        categoryChartData,
        topCategory,
        sixMonthTrend,
        recentTransactions,
        budgetVsActual,
        budgetAlerts,
        announcements,
        savingTips,
        latestInsight,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

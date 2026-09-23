import mongoose from 'mongoose';
import { Budget } from '../models/Budget.js';
import { Transaction } from '../models/Transaction.js';
import { Notification } from '../models/Notification.js';
import { RecurringTransaction } from '../models/RecurringTransaction.js';
import { Category } from '../models/Category.js';

export const checkBudgetThresholds = async (userId: mongoose.Types.ObjectId, categoryId: mongoose.Types.ObjectId, transactionDate: Date) => {
  const d = new Date(transactionDate);
  const month = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`;

  const budget = await Budget.findOne({ userId, categoryId, month });
  if (!budget) return null;

  const startOfMonth = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1));
  const endOfMonth = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 0, 23, 59, 59));

  const spentAgg = await Transaction.aggregate([
    {
      $match: {
        userId,
        categoryId,
        type: 'expense',
        date: { $gte: startOfMonth, $lte: endOfMonth },
      },
    },
    {
      $group: {
        _id: null,
        total: { $sum: '$amount' },
      },
    },
  ]);

  const spent = spentAgg[0]?.total || 0;
  const usagePct = Math.round((spent / budget.limitAmount) * 100);

  const category = await Category.findById(categoryId);
  const categoryName = category ? category.name : 'Category';

  if (usagePct >= 100) {
    // Check if notification already sent this month
    const existing = await Notification.findOne({
      userId,
      type: 'budget_exceeded',
      message: { $regex: new RegExp(`${categoryName}.*${month}`) },
    });

    if (!existing) {
      await Notification.create({
        userId,
        title: `🚨 Budget Exceeded: ${categoryName}`,
        message: `You have spent $${spent.toLocaleString()} (${usagePct}%) of your $${budget.limitAmount.toLocaleString()} ${categoryName} budget for ${month}.`,
        type: 'budget_exceeded',
        link: '/budgets',
      });
    }
  } else if (usagePct >= 75) {
    const existing = await Notification.findOne({
      userId,
      type: 'budget_warning',
      message: { $regex: new RegExp(`${categoryName}.*${month}`) },
    });

    if (!existing) {
      await Notification.create({
        userId,
        title: `⚠️ Budget Warning: ${categoryName}`,
        message: `You have reached ${usagePct}% ($${spent.toLocaleString()} / $${budget.limitAmount.toLocaleString()}) of your ${categoryName} budget for ${month}.`,
        type: 'budget_warning',
        link: '/budgets',
      });
    }
  }

  return { spent, limitAmount: budget.limitAmount, usagePct };
};

export const processRecurringTransactions = async () => {
  const now = new Date();
  const dueRecurring = await RecurringTransaction.find({
    isActive: true,
    nextRunDate: { $lte: now },
  });

  for (const item of dueRecurring) {
    // Create new transaction
    await Transaction.create({
      userId: item.userId,
      categoryId: item.categoryId,
      amount: item.amount,
      type: item.type,
      description: `[Auto-Recurring] ${item.description}`,
      date: now,
      isRecurring: true,
      recurringFrequency: item.frequency,
    });

    // Compute next run date
    const nextDate = new Date(item.nextRunDate);
    if (item.frequency === 'weekly') {
      nextDate.setDate(nextDate.getDate() + 7);
    } else {
      nextDate.setMonth(nextDate.getMonth() + 1);
    }

    item.lastRunDate = now;
    item.nextRunDate = nextDate;
    await item.save();

    // Check budget alert
    await checkBudgetThresholds(item.userId, item.categoryId, now);
  }
};

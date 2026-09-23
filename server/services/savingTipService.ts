import mongoose from 'mongoose';
import { Transaction } from '../models/Transaction.js';
import { SavingTip } from '../models/SavingTip.js';
import { User } from '../models/User.js';

export const getPersonalizedTips = async (userId: mongoose.Types.ObjectId) => {
  const user = await User.findById(userId);
  const now = new Date();

  // Current month range
  const currentMonthStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
  // Previous month range
  const prevMonthStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1, 1));
  const prevMonthEnd = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 0, 23, 59, 59));

  // Current month category spending
  const currentSpending = await Transaction.aggregate([
    {
      $match: {
        userId,
        type: 'expense',
        date: { $gte: currentMonthStart },
      },
    },
    {
      $lookup: {
        from: 'categories',
        localField: 'categoryId',
        foreignField: '_id',
        as: 'category',
      },
    },
    { $unwind: '$category' },
    {
      $group: {
        _id: '$category.name',
        total: { $sum: '$amount' },
      },
    },
  ]);

  // Previous month category spending
  const prevSpending = await Transaction.aggregate([
    {
      $match: {
        userId,
        type: 'expense',
        date: { $gte: prevMonthStart, $lte: prevMonthEnd },
      },
    },
    {
      $lookup: {
        from: 'categories',
        localField: 'categoryId',
        foreignField: '_id',
        as: 'category',
      },
    },
    { $unwind: '$category' },
    {
      $group: {
        _id: '$category.name',
        total: { $sum: '$amount' },
      },
    },
  ]);

  const prevMap: Record<string, number> = {};
  for (const p of prevSpending) {
    prevMap[p._id] = p.total;
  }

  const generatedTips: any[] = [];

  for (const c of currentSpending) {
    const categoryName = c._id;
    const currentAmount = c.total;
    const prevAmount = prevMap[categoryName] || 0;

    if (prevAmount > 0 && currentAmount > prevAmount * 1.2) {
      const pct = Math.round(((currentAmount - prevAmount) / prevAmount) * 100);
      generatedTips.push({
        _id: new mongoose.Types.ObjectId(),
        title: `${categoryName} spending increased by ${pct}%`,
        description: `Your ${categoryName.toLowerCase()} expenses are significantly higher than last month. Consider setting a weekly ${categoryName.toLowerCase()} budget or seeking campus student discounts.`,
        category: categoryName,
        potentialSavingImpact: Math.round(currentAmount - prevAmount),
        priority: 1,
        isSystemTip: false,
        createdAt: new Date(),
      });
    }

    if (categoryName.toLowerCase() === 'food' && currentAmount > 20000) {
      generatedTips.push({
        _id: new mongoose.Types.ObjectId(),
        title: 'High dining & food expense detected',
        description: 'Cooking with dorm roommates or utilizing university dining hall meal passes can save you up to 35% on food costs.',
        category: 'Food',
        potentialSavingImpact: Math.round(currentAmount * 0.25),
        priority: 2,
        isSystemTip: false,
        createdAt: new Date(),
      });
    }

    if (categoryName.toLowerCase() === 'subscriptions' && currentAmount > 3000) {
      generatedTips.push({
        _id: new mongoose.Types.ObjectId(),
        title: 'Review recurring entertainment & app subscriptions',
        description: 'Check your active subscriptions (streaming, music, cloud storage). Many services offer student bundle rates with an .edu email.',
        category: 'Subscriptions',
        potentialSavingImpact: Math.round(currentAmount * 0.4),
        priority: 2,
        isSystemTip: false,
        createdAt: new Date(),
      });
    }
  }

  // Check savings goal
  const currentIncomeAgg = await Transaction.aggregate([
    {
      $match: {
        userId,
        type: 'income',
        date: { $gte: currentMonthStart },
      },
    },
    {
      $group: {
        _id: null,
        total: { $sum: '$amount' },
      },
    },
  ]);

  const currentExpenseTotal = currentSpending.reduce((acc, curr) => acc + curr.total, 0);
  const currentIncomeTotal = currentIncomeAgg[0]?.total || 0;
  const currentSavings = currentIncomeTotal - currentExpenseTotal;

  if (user?.savingsGoal && currentSavings < user.savingsGoal) {
    const deficit = user.savingsGoal - currentSavings;
    generatedTips.push({
      _id: new mongoose.Types.ObjectId(),
      title: `Savings Goal Gap: $${deficit.toLocaleString()} to go`,
      description: `You are aiming to save $${user.savingsGoal.toLocaleString()} this month. Trimming non-essential weekend outings will help you hit your target.`,
      category: 'Savings',
      potentialSavingImpact: deficit,
      priority: 1,
      isSystemTip: false,
      createdAt: new Date(),
    });
  }

  // Fetch active system tips
  const systemTips = await SavingTip.find({ isActive: true }).sort({ priority: 1 }).limit(6);

  // Combine personalized tips first, then system tips
  return [...generatedTips, ...systemTips];
};

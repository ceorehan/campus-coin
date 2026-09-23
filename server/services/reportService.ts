import mongoose from 'mongoose';
import { Transaction } from '../models/Transaction.js';

export const getMonthlyReportData = async (userId: mongoose.Types.ObjectId, yearMonth: string) => {
  const [yearStr, monthStr] = yearMonth.split('-');
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10);

  const startOfMonth = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0));
  const endOfMonth = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999));

  // Aggregate totals by type
  const totals = await Transaction.aggregate([
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
        count: { $sum: 1 },
      },
    },
  ]);

  let income = 0;
  let expenses = 0;
  let transactionCount = 0;

  for (const item of totals) {
    if (item._id === 'income') income = item.total;
    if (item._id === 'expense') expenses = item.total;
    transactionCount += item.count;
  }

  const savings = income - expenses;
  const savingsRate = income > 0 ? Math.round((savings / income) * 100) : 0;

  return {
    month: yearMonth,
    income,
    expenses,
    savings,
    savingsRate,
    transactionCount,
  };
};

export const getCategoryReportData = async (
  userId: mongoose.Types.ObjectId,
  yearMonth?: string,
  type: 'expense' | 'income' = 'expense'
) => {
  const matchStage: any = {
    userId,
    type,
  };

  if (yearMonth) {
    const [yearStr, monthStr] = yearMonth.split('-');
    const year = parseInt(yearStr, 10);
    const month = parseInt(monthStr, 10);
    matchStage.date = {
      $gte: new Date(Date.UTC(year, month - 1, 1, 0, 0, 0)),
      $lte: new Date(Date.UTC(year, month, 0, 23, 59, 59, 999)),
    };
  }

  const result = await Transaction.aggregate([
    { $match: matchStage },
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
    {
      $project: {
        _id: 1,
        name: '$category.name',
        color: '$category.color',
        icon: '$category.icon',
        totalAmount: 1,
        count: 1,
      },
    },
    { $sort: { totalAmount: -1 } },
  ]);

  const totalSum = result.reduce((acc, curr) => acc + curr.totalAmount, 0);

  const categoriesWithPct = result.map((item) => ({
    categoryId: item._id,
    name: item.name,
    color: item.color,
    icon: item.icon,
    total: item.totalAmount,
    count: item.count,
    percentage: totalSum > 0 ? Math.round((item.totalAmount / totalSum) * 100) : 0,
  }));

  return {
    total: totalSum,
    categories: categoriesWithPct,
  };
};

export const getSixMonthTrend = async (userId: mongoose.Types.ObjectId) => {
  const now = new Date();
  // 6 months ago from 1st of month
  const startDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 5, 1, 0, 0, 0));

  const aggregation = await Transaction.aggregate([
    {
      $match: {
        userId,
        date: { $gte: startDate },
      },
    },
    {
      $project: {
        month: { $dateToString: { format: '%Y-%m', date: '$date' } },
        amount: 1,
        type: 1,
      },
    },
    {
      $group: {
        _id: { month: '$month', type: '$type' },
        total: { $sum: '$amount' },
      },
    },
    { $sort: { '_id.month': 1 } },
  ]);

  // Generate 6 months list
  const months: string[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - i, 1));
    const mStr = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`;
    months.push(mStr);
  }

  const trendMap: Record<string, { month: string; income: number; expenses: number; savings: number }> = {};
  for (const m of months) {
    trendMap[m] = { month: m, income: 0, expenses: 0, savings: 0 };
  }

  for (const row of aggregation) {
    const m = row._id.month;
    if (trendMap[m]) {
      if (row._id.type === 'income') {
        trendMap[m].income = row.total;
      } else {
        trendMap[m].expenses = row.total;
      }
    }
  }

  for (const m of months) {
    trendMap[m].savings = trendMap[m].income - trendMap[m].expenses;
  }

  return Object.values(trendMap);
};

export const getDailySpending = async (userId: mongoose.Types.ObjectId, yearMonth: string) => {
  const [yearStr, monthStr] = yearMonth.split('-');
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10);

  const startOfMonth = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0));
  const endOfMonth = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999));

  const aggregation = await Transaction.aggregate([
    {
      $match: {
        userId,
        type: 'expense',
        date: { $gte: startOfMonth, $lte: endOfMonth },
      },
    },
    {
      $project: {
        day: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
        amount: 1,
      },
    },
    {
      $group: {
        _id: '$day',
        total: { $sum: '$amount' },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  return aggregation.map((item) => ({
    date: item._id,
    dayNumber: parseInt(item._id.split('-')[2], 10),
    amount: item.total,
    count: item.count,
  }));
};

export const getWeeklySpending = async (userId: mongoose.Types.ObjectId, yearMonth: string) => {
  const [yearStr, monthStr] = yearMonth.split('-');
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10);

  const startOfMonth = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0));
  const endOfMonth = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999));

  const aggregation = await Transaction.aggregate([
    {
      $match: {
        userId,
        type: 'expense',
        date: { $gte: startOfMonth, $lte: endOfMonth },
      },
    },
    {
      $project: {
        dayOfMonth: { $dayOfMonth: '$date' },
        amount: 1,
      },
    },
  ]);

  const weeks = [
    { week: 'Week 1 (1-7)', total: 0, count: 0 },
    { week: 'Week 2 (8-14)', total: 0, count: 0 },
    { week: 'Week 3 (15-21)', total: 0, count: 0 },
    { week: 'Week 4 (22-28)', total: 0, count: 0 },
    { week: 'Week 5 (29-31)', total: 0, count: 0 },
  ];

  for (const item of aggregation) {
    const d = item.dayOfMonth;
    if (d <= 7) {
      weeks[0].total += item.amount;
      weeks[0].count++;
    } else if (d <= 14) {
      weeks[1].total += item.amount;
      weeks[1].count++;
    } else if (d <= 21) {
      weeks[2].total += item.amount;
      weeks[2].count++;
    } else if (d <= 28) {
      weeks[3].total += item.amount;
      weeks[3].count++;
    } else {
      weeks[4].total += item.amount;
      weeks[4].count++;
    }
  }

  return weeks;
};

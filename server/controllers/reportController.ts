import { Response } from 'express';
import mongoose from 'mongoose';
import { AuthRequest } from '../middleware/authMiddleware.js';
import { Transaction } from '../models/Transaction.js';
import {
  getMonthlyReportData,
  getCategoryReportData,
  getSixMonthTrend,
  getDailySpending,
  getWeeklySpending,
} from '../services/reportService.js';

// @desc    Get monthly financial report
// @route   GET /api/reports/monthly
export const getMonthlyReport = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!._id;
    const now = new Date();
    const currentMonth = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}`;
    const month = (req.query.month as string) || currentMonth;

    const data = await getMonthlyReportData(userId, month);
    return res.status(200).json({ success: true, data });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get category report
// @route   GET /api/reports/category
export const getCategoryReport = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!._id;
    const { month, type = 'expense' } = req.query;

    const data = await getCategoryReportData(
      userId,
      month as string | undefined,
      type as 'expense' | 'income'
    );
    return res.status(200).json({ success: true, data });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get six-month trends
// @route   GET /api/reports/six-month
export const getSixMonthReport = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!._id;
    const data = await getSixMonthTrend(userId);
    return res.status(200).json({ success: true, data });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get daily spending for the current/selected month
// @route   GET /api/reports/daily
export const getDailyReport = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!._id;
    const now = new Date();
    const currentMonth = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}`;
    const month = (req.query.month as string) || currentMonth;

    const data = await getDailySpending(userId, month);
    return res.status(200).json({ success: true, data });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get weekly spending for the current/selected month
// @route   GET /api/reports/weekly
export const getWeeklyReport = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!._id;
    const now = new Date();
    const currentMonth = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}`;
    const month = (req.query.month as string) || currentMonth;

    const data = await getWeeklySpending(userId, month);
    return res.status(200).json({ success: true, data });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Export financial reports / transactions
// @route   GET /api/reports/export
export const exportReport = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!._id;
    const { startDate, endDate, categoryId, type, format = 'json' } = req.query;

    const query: any = { userId };

    if (type && (type === 'income' || type === 'expense')) {
      query.type = type;
    }

    if (categoryId && mongoose.Types.ObjectId.isValid(categoryId as string)) {
      query.categoryId = new mongoose.Types.ObjectId(categoryId as string);
    }

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate as string);
      if (endDate) {
        const end = new Date(endDate as string);
        end.setHours(23, 59, 59, 999);
        query.date.$lte = end;
      }
    }

    const transactions = await Transaction.find(query)
      .populate('categoryId', 'name type')
      .sort({ date: -1 });

    const rows = transactions.map((t) => ({
      date: t.date.toISOString().slice(0, 10),
      type: t.type,
      category: (t.categoryId as any)?.name || 'Unknown',
      amount: t.amount,
      description: t.description,
      isRecurring: t.isRecurring ? 'Yes' : 'No',
    }));

    if (format === 'csv') {
      let csvContent = 'Date,Type,Category,Amount,Description,Recurring\n';
      for (const r of rows) {
        csvContent += `"${r.date}","${r.type}","${r.category}",${r.amount},"${r.description.replace(/"/g, '""')}","${r.isRecurring}"\n`;
      }
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=campus_coin_report_${new Date().toISOString().slice(0, 10)}.csv`);
      return res.status(200).send(csvContent);
    }

    return res.status(200).json({
      success: true,
      data: {
        totalRecords: rows.length,
        records: rows,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

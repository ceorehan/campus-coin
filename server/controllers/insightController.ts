import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware.js';
import { Insight } from '../models/Insight.js';
import { Transaction } from '../models/Transaction.js';
import { Notification } from '../models/Notification.js';
import { generateMonthlyInsight } from '../services/aiService.js';
import { getMonthlyReportData, getCategoryReportData } from '../services/reportService.js';

// @desc    Get all insights for student
// @route   GET /api/insights
export const getInsights = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!._id;
    const insights = await Insight.find({ userId }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: insights,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Generate / refresh monthly insight
// @route   POST /api/insights/generate
export const generateInsight = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!._id;
    const now = new Date();
    const currentMonth = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}`;
    const month = req.body.month || currentMonth;

    // Check transaction count for user in this month
    const monthlyReport = await getMonthlyReportData(userId, month);
    if (monthlyReport.transactionCount === 0) {
      return res.status(400).json({
        success: false,
        message: 'Not enough transaction data yet. Add some transactions for this month first.',
      });
    }

    const categoryReport = await getCategoryReportData(userId, month, 'expense');

    // Previous month spending for comparison
    const [yearStr, monthStr] = month.split('-');
    let prevYear = parseInt(yearStr, 10);
    let prevMonth = parseInt(monthStr, 10) - 1;
    if (prevMonth === 0) {
      prevMonth = 12;
      prevYear -= 1;
    }
    const prevMonthStr = `${prevYear}-${String(prevMonth).padStart(2, '0')}`;
    const prevReport = await getMonthlyReportData(userId, prevMonthStr);

    const topCategory = categoryReport.categories[0]?.name || 'General';

    const aiResult = await generateMonthlyInsight({
      month,
      totalIncome: monthlyReport.income,
      totalExpense: monthlyReport.expenses,
      savings: monthlyReport.savings,
      categoryBreakdown: categoryReport.categories.map((c) => ({
        category: c.name,
        amount: c.total,
        percentage: c.percentage,
      })),
      previousMonthExpense: prevReport.expenses,
      topCategory,
    });

    const pctChange = prevReport.expenses > 0
      ? Math.round(((monthlyReport.expenses - prevReport.expenses) / prevReport.expenses) * 100)
      : 0;

    // Save or update existing insight for this month
    let insight = await Insight.findOne({ userId, month });
    if (insight) {
      insight.summaryText = aiResult.summaryText;
      insight.tipText = aiResult.tipText;
      insight.topCategory = topCategory;
      insight.spendingChangePct = pctChange;
      insight.totalSpent = monthlyReport.expenses;
      insight.generatedAt = new Date();
      await insight.save();
    } else {
      insight = await Insight.create({
        userId,
        month,
        summaryText: aiResult.summaryText,
        tipText: aiResult.tipText,
        topCategory,
        spendingChangePct: pctChange,
        totalSpent: monthlyReport.expenses,
        generatedAt: new Date(),
      });
    }

    // In-app notification
    await Notification.create({
      userId,
      title: `✨ Monthly Spending Insight Ready (${month})`,
      message: `Your AI financial report and custom tips for ${month} have been generated.`,
      type: 'insight_ready',
      link: '/insights',
    });

    return res.status(201).json({
      success: true,
      message: 'Monthly insight generated successfully.',
      data: insight,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

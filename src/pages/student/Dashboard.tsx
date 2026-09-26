import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { transactionService } from '../../services/transactionService';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { DashboardStats } from '../../components/dashboard/StatCards';
import { ExpenseChart } from '../../components/dashboard/ExpenseChart';
import { SpendingTrend } from '../../components/dashboard/SpendingTrend';
import { RecentTransactions } from '../../components/dashboard/RecentTransactions';
import { BudgetAlerts } from '../../components/dashboard/BudgetAlerts';
import { MonthlyInsightCard } from '../../components/dashboard/MonthlyInsight';
import { SavingTipsCard } from '../../components/dashboard/SavingTips';
import { Loader } from '../../components/common/Loader';
import { PlusCircle, Upload, Megaphone, ArrowRight } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { currency } = useTheme();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState('');

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await transactionService.getDashboardSummary();
      if (res.success && res.data) {
        setData(res.data);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load student dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return <Loader message="Analyzing student cash flow & budgets..." />;
  }

  if (error || !data) {
    return (
      <div className="p-8 text-center space-y-3">
        <p className="text-xs text-rose-600">{error || 'Could not load dashboard'}</p>
        <button
          onClick={fetchDashboardData}
          className="px-4 py-2 rounded-xl text-xs font-semibold bg-brand-600 text-white"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Welcome Banner & Quick Action Buttons */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Hi, {user?.name || 'Student'} 👋
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Academic Status: <strong className="text-brand-600 dark:text-brand-400">{user?.academicYear || 'Undergraduate'}</strong> • Here's your financial run-rate for this semester.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/import"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 transition-colors shadow-xs"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Import CSV</span>
          </Link>
          <Link
            to="/transactions/new"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-md shadow-brand-500/20 transition-all"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>+ Add Expense</span>
          </Link>
        </div>
      </div>

      {/* University Admin Announcements (if any) */}
      {data.announcements && data.announcements.length > 0 && (
        <div className="space-y-2">
          {data.announcements.map((ann: any) => (
            <div
              key={ann._id}
              className="p-4 rounded-2xl bg-gradient-to-r from-brand-50 to-purple-50 dark:from-brand-950/40 dark:to-slate-900 border border-brand-100 dark:border-brand-900/50 flex items-start gap-3"
            >
              <Megaphone className="w-5 h-5 text-brand-600 dark:text-brand-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">{ann.title}</h4>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">
                  {ann.message}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Top Stat Cards */}
      <DashboardStats data={data.cards} currency={currency} />

      {/* Threshold Alerts Banner (Safe or warnings) */}
      <div>
        <BudgetAlerts alerts={data.budgetAlerts} currency={currency} />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Category Breakdown (Donut Chart) */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Category Breakdown
            </h3>
            <Link
              to="/categories"
              className="text-[11px] font-semibold text-brand-600 dark:text-brand-400 hover:underline"
            >
              Manage
            </Link>
          </div>
          <ExpenseChart data={data.categoryChartData} currency={currency} />
        </div>

        {/* 6-Month Trend (Area Chart) */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                6-Month Spending Velocity
              </h3>
              <p className="text-[11px] text-slate-400">
                Income (green) vs Expenses (red) trajectory
              </p>
            </div>
            <Link
              to="/reports"
              className="text-[11px] font-semibold text-brand-600 dark:text-brand-400 hover:underline"
            >
              Full Reports
            </Link>
          </div>
          <SpendingTrend data={data.sixMonthTrend} currency={currency} />
        </div>
      </div>

      {/* Recent Transactions & AI Insights / Saving Tips Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Transactions */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Recent Transactions
            </h3>
            <Link
              to="/transactions"
              className="text-[11px] font-semibold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
            >
              <span>View Ledger</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <RecentTransactions
            transactions={data.recentTransactions}
            currency={currency}
          />
        </div>

        {/* AI Insight & Saving Tips Side Column */}
        <div className="space-y-6">
          <MonthlyInsightCard insight={data.latestInsight} />

          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Student Saving Tips
              </h3>
              <Link
                to="/saving-tips"
                className="text-[11px] font-semibold text-brand-600 dark:text-brand-400 hover:underline"
              >
                All
              </Link>
            </div>
            <SavingTipsCard tips={data.savingTips} currency={currency} />
          </div>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { Wallet, TrendingUp, TrendingDown, Target, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { formatCurrency } from '../../utils/formatCurrency';

interface StatCardsProps {
  data: {
    totalBalance: number;
    monthlyBalance: number;
    totalIncome: number;
    totalExpenses: number;
    totalSavings: number;
    savingsRate: number;
    savingsGoal: number;
    savingsGoalProgress: number;
    monthlyAllowanceBaseline?: number;
  };
  currency?: string;
}

export const DashboardStats: React.FC<StatCardsProps> = ({ data, currency = 'USD' }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Net Balance Card */}
      <div className="relative overflow-hidden p-5 rounded-3xl bg-gradient-to-br from-indigo-600 to-violet-700 text-white shadow-xl shadow-indigo-500/10">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-indigo-100 uppercase tracking-wider">
            Total Balance
          </span>
          <div className="w-9 h-9 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white">
            <Wallet className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl lg:text-3xl font-black tracking-tight">
            {formatCurrency(data.totalBalance, currency)}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-indigo-100">
            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-white/15 text-[11px] font-semibold">
              This Month: {formatCurrency(data.monthlyBalance, currency)}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Total Income Card */}
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Monthly Income
          </span>
          <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <TrendingUp className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl lg:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {formatCurrency(data.totalIncome, currency)}
          </div>
          <div className="flex items-center gap-1 mt-2 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>Allowance & Work</span>
          </div>
        </div>
      </div>

      {/* 3. Total Expenses Card */}
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Monthly Expenses
          </span>
          <div className="w-9 h-9 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center">
            <TrendingDown className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl lg:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {formatCurrency(data.totalExpenses, currency)}
          </div>
          <div className="flex items-center gap-1 mt-2 text-xs text-rose-600 dark:text-rose-400 font-medium">
            <ArrowDownRight className="w-3.5 h-3.5" />
            <span>Meals, Hostel & Transit</span>
          </div>
        </div>
      </div>

      {/* 4. Savings Goal & Progress Card */}
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Savings Progress
          </span>
          <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <Target className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="flex items-baseline justify-between">
            <span className="text-2xl lg:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {data.savingsRate}%
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Goal: {formatCurrency(data.savingsGoal, currency)}
            </span>
          </div>
          {/* Progress bar */}
          <div className="mt-3 w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-indigo-600 dark:bg-indigo-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, Math.max(0, data.savingsGoalProgress))}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

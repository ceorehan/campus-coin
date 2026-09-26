import React, { useState, useEffect } from 'react';
import { reportService } from '../../services/reportService';
import { useTheme } from '../../context/ThemeContext';
import { ExpenseChart } from '../../components/dashboard/ExpenseChart';
import { SpendingTrend } from '../../components/dashboard/SpendingTrend';
import { Loader } from '../../components/common/Loader';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Download, Calendar, TrendingUp, TrendingDown, Wallet, Target } from 'lucide-react';
import { formatCurrency } from '../../utils/formatCurrency';

export const Reports: React.FC = () => {
  const { currency } = useTheme();

  const currentYearMonth = new Date().toISOString().slice(0, 7);
  const [selectedMonth, setSelectedMonth] = useState<string>(currentYearMonth);
  const [activeTab, setActiveTab] = useState<'monthly' | 'categories' | 'daily' | 'trends'>('monthly');

  const [loading, setLoading] = useState(true);
  const [monthlyData, setMonthlyData] = useState<any>(null);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [dailyData, setDailyData] = useState<any[]>([]);
  const [trendData, setTrendData] = useState<any[]>([]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const [mRes, cRes, dRes, tRes] = await Promise.all([
        reportService.getMonthlySummary(selectedMonth),
        reportService.getCategoryBreakdown(selectedMonth),
        reportService.getDailySpending(selectedMonth),
        reportService.getTrend(6),
      ]);

      if (mRes.success) setMonthlyData(mRes.data);
      if (cRes.success) setCategoryData(cRes.data);
      if (dRes.success) setDailyData(dRes.data);
      if (tRes.success) setTrendData(tRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [selectedMonth]);

  const handleExportCSV = async () => {
    await reportService.exportCSVReport(selectedMonth);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Financial Analytics & Reports
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Deep dive into your university cash velocity, category distribution, and trends
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs shadow-xs">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-transparent outline-none font-semibold text-slate-700 dark:text-slate-300"
            />
          </div>

          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto">
        {[
          { key: 'monthly', label: 'Monthly Summary' },
          { key: 'categories', label: 'Category Breakdown' },
          { key: 'daily', label: 'Daily Spending Velocity' },
          { key: 'trends', label: '6-Month Trend' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
              activeTab === tab.key
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <Loader message="Synthesizing financial reports..." />
      ) : (
        <>
          {/* Tab 1: Monthly Summary */}
          {activeTab === 'monthly' && monthlyData && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Monthly Income
                  </span>
                  <span className="text-2xl font-black text-emerald-600">
                    {formatCurrency(monthlyData.income, currency)}
                  </span>
                </div>

                <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Monthly Expenses
                  </span>
                  <span className="text-2xl font-black text-rose-600">
                    {formatCurrency(monthlyData.expenses, currency)}
                  </span>
                </div>

                <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Net Savings
                  </span>
                  <span className="text-2xl font-black text-slate-900 dark:text-white">
                    {formatCurrency(monthlyData.savings, currency)}
                  </span>
                </div>

                <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Savings Rate
                  </span>
                  <span className="text-2xl font-black text-brand-600">
                    {monthlyData.savingsRate}%
                  </span>
                </div>
              </div>

              {/* Highlights & Top Category */}
              <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Primary Spending Driver
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Your highest expense category for {selectedMonth} was{' '}
                    <strong className="text-brand-600 dark:text-brand-400">
                      {monthlyData.topCategory || 'N/A'}
                    </strong>
                    .
                  </p>
                </div>
                <div className="px-4 py-2 rounded-2xl bg-white dark:bg-slate-800 text-xs font-bold border border-slate-200 dark:border-slate-700 shadow-xs">
                  {monthlyData.transactionCount} transactions recorded this month
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Category Breakdown */}
          {activeTab === 'categories' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">
                  Expense Distribution Donut
                </h3>
                <ExpenseChart data={categoryData} currency={currency} />
              </div>

              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">
                  Category Value Bar Chart
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={categoryData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                      <XAxis dataKey="name" fontSize={11} stroke="#94a3b8" interval={0} angle={-25} textAnchor="end" />
                      <YAxis fontSize={11} stroke="#94a3b8" />
                      <Tooltip
                        formatter={(val: any) => [formatCurrency(Number(val), currency), 'Spent']}
                        contentStyle={{
                          backgroundColor: '#0f172a',
                          borderRadius: '12px',
                          color: '#fff',
                          fontSize: '12px',
                        }}
                      />
                      <Bar dataKey="value" fill="#6366f1" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Daily Velocity */}
          {activeTab === 'daily' && (
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                Day-by-Day Campus Spending
              </h3>
              <p className="text-xs text-slate-400 mb-4">
                Helps pinpoint which days of the week you tend to spend the most
              </p>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dailyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                    <XAxis dataKey="day" fontSize={11} stroke="#94a3b8" />
                    <YAxis fontSize={11} stroke="#94a3b8" />
                    <Tooltip
                      formatter={(val: any) => [formatCurrency(Number(val), currency), 'Daily Total']}
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        borderRadius: '12px',
                        color: '#fff',
                        fontSize: '12px',
                      }}
                    />
                    <Bar dataKey="amount" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Tab 4: 6-Month Trend */}
          {activeTab === 'trends' && (
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                Semester Spending Trajectory
              </h3>
              <p className="text-xs text-slate-400 mb-4">
                Track how your allowance vs expenses evolve across examination terms
              </p>
              <SpendingTrend data={trendData} currency={currency} />
            </div>
          )}
        </>
      )}
    </div>
  );
};

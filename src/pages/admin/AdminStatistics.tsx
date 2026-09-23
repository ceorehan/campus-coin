import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { useTheme } from '../../context/ThemeContext';
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
import { formatCurrency } from '../../utils/formatCurrency';

export const AdminStatistics: React.FC = () => {
  const { currency } = useTheme();

  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await adminService.getStatistics();
      if (res.success && res.data) {
        setStats(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return <Loader message="Compiling campus telemetry..." />;
  }

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          Campus Financial Analytics & Telemetry
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Macro indicators of university students' spending health, category volumes, and allowance runtimes
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">
            Top Categories by Dollar Volume
          </h3>
          <p className="text-xs text-slate-400 mb-4">
            Aggregated transactions recorded across all active student cohorts
          </p>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats?.topCategories || []} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="categoryName" fontSize={11} stroke="#94a3b8" />
                <YAxis fontSize={11} stroke="#94a3b8" />
                <Tooltip
                  formatter={(val: any) => [formatCurrency(Number(val), currency), 'Campus Total']}
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="total" fill="#6366f1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Platform Engagement KPIs
          </h3>
          <div className="space-y-3">
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between text-xs">
              <span className="text-slate-600 dark:text-slate-400">Total Student Accounts</span>
              <span className="font-bold text-slate-900 dark:text-white">{stats?.totalUsers || 0}</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between text-xs">
              <span className="text-slate-600 dark:text-slate-400">Total Transactions Tracked</span>
              <span className="font-bold text-slate-900 dark:text-white">{stats?.totalTransactions || 0}</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between text-xs">
              <span className="text-slate-600 dark:text-slate-400">Active Students Ratio</span>
              <span className="font-bold text-emerald-600">
                {stats?.totalUsers
                  ? `${Math.round(((stats.activeUsers || 0) / stats.totalUsers) * 100)}%`
                  : '100%'}
              </span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between text-xs">
              <span className="text-slate-600 dark:text-slate-400">Net Allowance Volume</span>
              <span className="font-bold text-slate-900 dark:text-white">
                {formatCurrency(stats?.totalIncomeVolume || 0, currency)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

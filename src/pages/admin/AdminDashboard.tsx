import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { useTheme } from '../../context/ThemeContext';
import { Loader } from '../../components/common/Loader';
import {
  Users,
  Receipt,
  DollarSign,
  Megaphone,
  TrendingUp,
  Tag,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatCurrency } from '../../utils/formatCurrency';

export const AdminDashboard: React.FC = () => {
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
    return <Loader message="Aggregating campus system statistics..." />;
  }

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          System Administration Overview
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Campus-wide student adoption, aggregate volume, and active financial aid announcements
        </p>
      </div>

      {/* Top Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase">Total Students</span>
            <Users className="w-4 h-4 text-brand-500" />
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              {stats?.totalUsers || 0}
            </span>
            <span className="text-[11px] text-emerald-600 block mt-1">
              {stats?.activeUsers || 0} currently active
            </span>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase">Transactions Recorded</span>
            <Receipt className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              {stats?.totalTransactions || 0}
            </span>
            <span className="text-[11px] text-slate-400 block mt-1">
              Logged across all campus users
            </span>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase">Campus Expense Volume</span>
            <DollarSign className="w-4 h-4 text-rose-500" />
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              {formatCurrency(stats?.totalExpenseVolume || 0, currency)}
            </span>
            <span className="text-[11px] text-slate-400 block mt-1">Tracked university outflows</span>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase">Allowance Volume</span>
            <TrendingUp className="w-4 h-4 text-purple-500" />
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              {formatCurrency(stats?.totalIncomeVolume || 0, currency)}
            </span>
            <span className="text-[11px] text-slate-400 block mt-1">Disbursed or earned</span>
          </div>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          to="/admin/users"
          className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-brand-500 transition-all flex items-center justify-between group"
        >
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-brand-600 transition-colors">
              User Management
            </h4>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Review student accounts and enable or disable access
            </p>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-brand-600 group-hover:translate-x-1 transition-all" />
        </Link>

        <Link
          to="/admin/categories"
          className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-brand-500 transition-all flex items-center justify-between group"
        >
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-brand-600 transition-colors">
              Default Categories
            </h4>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Maintain university taxonomies and color keys
            </p>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-brand-600 group-hover:translate-x-1 transition-all" />
        </Link>

        <Link
          to="/admin/announcements"
          className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-brand-500 transition-all flex items-center justify-between group"
        >
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-brand-600 transition-colors">
              Campus Announcements
            </h4>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Broadcast financial notices to student dashboards
            </p>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-brand-600 group-hover:translate-x-1 transition-all" />
        </Link>
      </div>

      {/* Top Categories across the university */}
      {stats?.topCategories && stats.topCategories.length > 0 && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">
            Cross-Campus Category Volume
          </h3>
          <div className="space-y-3">
            {stats.topCategories.map((c: any, i: number) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  {c.categoryName}
                </span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {formatCurrency(c.total, currency)} ({c.count} transactions)
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

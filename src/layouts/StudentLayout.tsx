import React from 'react';
import { Outlet, Navigate, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Navbar } from '../components/common/Navbar';
import { Sidebar } from '../components/common/Sidebar';
import { Footer } from '../components/common/Footer';
import { Loader } from '../components/common/Loader';
import {
  LayoutDashboard,
  Receipt,
  PlusCircle,
  PieChart,
  BarChart3,
  Bell,
} from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';

export const StudentLayout: React.FC = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const { unreadCount } = useNotifications();

  if (loading) {
    return <Loader fullScreen message="Authenticating student session..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      <Navbar />
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 pb-20 md:pb-8">
          <Outlet />
        </main>
      </div>

      {/* Mobile bottom nav bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-4 py-2 flex items-center justify-around">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 text-[10px] font-semibold ${
              isActive ? 'text-brand-600 dark:text-brand-400' : 'text-slate-500'
            }`
          }
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Home</span>
        </NavLink>

        <NavLink
          to="/transactions"
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 text-[10px] font-semibold ${
              isActive ? 'text-brand-600 dark:text-brand-400' : 'text-slate-500'
            }`
          }
        >
          <Receipt className="w-4 h-4" />
          <span>Ledger</span>
        </NavLink>

        <NavLink
          to="/transactions/new"
          className="flex flex-col items-center -mt-5"
        >
          <div className="w-11 h-11 rounded-full bg-brand-600 text-white flex items-center justify-center shadow-lg shadow-brand-600/30">
            <PlusCircle className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-semibold text-brand-600 dark:text-brand-400 mt-0.5">
            Add
          </span>
        </NavLink>

        <NavLink
          to="/budgets"
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 text-[10px] font-semibold ${
              isActive ? 'text-brand-600 dark:text-brand-400' : 'text-slate-500'
            }`
          }
        >
          <PieChart className="w-4 h-4" />
          <span>Budgets</span>
        </NavLink>

        <NavLink
          to="/notifications"
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 text-[10px] font-semibold relative ${
              isActive ? 'text-brand-600 dark:text-brand-400' : 'text-slate-500'
            }`
          }
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-rose-500" />
          )}
          <span>Alerts</span>
        </NavLink>
      </div>

      <Footer />
    </div>
  );
};

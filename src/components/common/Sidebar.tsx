import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Receipt,
  PlusCircle,
  Tag,
  PieChart,
  BarChart3,
  Lightbulb,
  Compass,
  Bookmark,
  Bell,
  User,
  Settings,
  Upload,
} from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';

export const Sidebar: React.FC = () => {
  const { unreadCount } = useNotifications();

  const links = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/transactions', label: 'Transactions', icon: Receipt },
    { to: '/transactions/new', label: 'Add Transaction', icon: PlusCircle, highlight: true },
    { to: '/import', label: 'CSV Import', icon: Upload },
    { to: '/categories', label: 'Categories', icon: Tag },
    { to: '/budgets', label: 'Budgets', icon: PieChart },
    { to: '/reports', label: 'Reports', icon: BarChart3 },
    { to: '/insights', label: 'AI Insights', icon: Lightbulb },
    { to: '/saving-tips', label: 'Saving Tips', icon: Compass },
    { to: '/bookmarks', label: 'Bookmarks', icon: Bookmark },
    { to: '/notifications', label: 'Notifications', icon: Bell, badge: unreadCount },
    { to: '/profile', label: 'Profile & Goal', icon: User },
    { to: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 hidden md:flex flex-col shrink-0 min-h-[calc(100vh-4rem)] p-4 transition-colors">
      <div className="space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/dashboard'}
              className={({ isActive }) =>
                `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-brand-600 text-white shadow-md shadow-brand-500/20'
                    : link.highlight
                    ? 'text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/40 hover:bg-brand-100 dark:hover:bg-brand-900/50'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <Icon className="w-4 h-4 shrink-0" />
                <span>{link.label}</span>
              </div>
              {link.badge !== undefined && link.badge > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500 text-white">
                  {link.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* Helpful student tip banner at sidebar bottom */}
      <div className="mt-auto pt-6">
        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-brand-50 to-purple-50 dark:from-brand-950/40 dark:to-slate-800/40 border border-brand-100 dark:border-brand-900/40 text-left">
          <div className="flex items-center gap-1.5 text-brand-600 dark:text-brand-400 text-xs font-bold mb-1">
            <Lightbulb className="w-3.5 h-3.5" />
            <span>Campus Tip</span>
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-tight">
            Log small daily snacks & bus rides. Those $2-$4 costs add up over the semester!
          </p>
        </div>
      </div>
    </aside>
  );
};

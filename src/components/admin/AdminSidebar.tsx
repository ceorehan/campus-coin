import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  ShieldCheck,
  Users,
  Tags,
  Compass,
  Megaphone,
  BarChart2,
  Settings,
} from 'lucide-react';

export const AdminSidebar: React.FC = () => {
  const links = [
    { to: '/admin', label: 'Admin Overview', icon: ShieldCheck, exact: true },
    { to: '/admin/users', label: 'User Management', icon: Users },
    { to: '/admin/categories', label: 'Default Categories', icon: Tags },
    { to: '/admin/tips', label: 'Saving Tips', icon: Compass },
    { to: '/admin/announcements', label: 'Announcements', icon: Megaphone },
    { to: '/admin/statistics', label: 'System Analytics', icon: BarChart2 },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-white border-r border-slate-800 hidden md:flex flex-col shrink-0 min-h-[calc(100vh-4rem)] p-4">
      <div className="px-3 py-2 mb-4 rounded-2xl bg-indigo-950/60 border border-indigo-800/40">
        <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 block">
          Control Panel
        </span>
        <span className="text-xs font-bold text-white">Campus Coin Administrator</span>
      </div>

      <div className="space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.exact}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{link.label}</span>
            </NavLink>
          );
        })}
      </div>
    </aside>
  );
};

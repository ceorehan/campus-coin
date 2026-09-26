import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ExternalLink, ShieldCheck, UserCheck, Globe } from 'lucide-react';

export const Sitemap: React.FC = () => {
  const sections = [
    {
      title: 'Public Pages (SRS Public Scope)',
      icon: Globe,
      color: 'text-brand-600 dark:text-brand-400',
      links: [
        { path: '/', label: 'Home Page', desc: 'Hero introduction, demo credentials overview, core pillars' },
        { path: '/features', label: 'Features Specification', desc: 'Detailed breakdown of student budgeting tools' },
        { path: '/how-it-works', label: 'How It Works', desc: 'Step-by-step workflow from allowance setup to insights' },
        { path: '/about', label: 'About Campus Coin', desc: 'Mission, values, and student privacy guarantees' },
        { path: '/contact', label: 'Contact & Feedback', desc: 'Direct feedback and student inquiry form' },
        { path: '/sitemap', label: 'Complete Sitemap (Current)', desc: 'Hierarchical structural directory of the entire application' },
      ],
    },
    {
      title: 'Authentication & Account Recovery',
      icon: UserCheck,
      color: 'text-emerald-600 dark:text-emerald-400',
      links: [
        { path: '/login', label: 'Student / User Login', desc: 'JWT authentication with 1-click Demo credentials' },
        { path: '/register', label: 'Student Registration', desc: 'Create account with academic year and allowance baseline' },
        { path: '/forgot-password', label: 'Forgot Password', desc: 'Generate 6-digit password reset security code' },
        { path: '/reset-password', label: 'Reset Password', desc: 'Submit reset code and configure new password' },
      ],
    },
    {
      title: 'Student Portal & Budget Management',
      icon: BookOpen,
      color: 'text-purple-600 dark:text-purple-400',
      links: [
        { path: '/dashboard', label: 'Student Dashboard', desc: 'Real-time balance, savings goal progress, trends, alerts' },
        { path: '/transactions', label: 'Transaction Ledger', desc: 'Paginated, filterable table with search, type, and dates' },
        { path: '/transactions/new', label: 'Add / Log Transaction', desc: 'Manual transaction entry with Gemini AI category detection' },
        { path: '/import', label: 'CSV Statement Import', desc: 'Upload, validate, preview, and import bank statements' },
        { path: '/categories', label: 'Category Management', desc: 'View system defaults and create custom student categories' },
        { path: '/budgets', label: 'Monthly Budgets & Limits', desc: 'Category caps with real-time 75% and 100% threshold indicators' },
        { path: '/reports', label: 'Financial Analytics & Export', desc: 'Monthly, category, daily, weekly, 6-month charts, CSV export' },
        { path: '/insights', label: 'AI Monthly Digests', desc: 'Gemini-generated spending reviews and actionable recommendations' },
        { path: '/saving-tips', label: 'Campus Saving Tips', desc: 'Personalized and community university money-saving hacks' },
        { path: '/bookmarks', label: 'Saved Bookmarks', desc: 'Saved saving tips, reports, and AI insight highlights' },
        { path: '/notifications', label: 'Notification Center', desc: 'System alerts, threshold warnings, and recurring transaction notes' },
        { path: '/profile', label: 'Student Profile & Goals', desc: 'Manage savings targets, academic year, and baseline allowance' },
        { path: '/settings', label: 'App Settings & Appearance', desc: 'Light/Dark mode, normal/large text sizing, currency select' },
      ],
    },
    {
      title: 'Administration Portal (SRS Admin Scope)',
      icon: ShieldCheck,
      color: 'text-rose-600 dark:text-rose-400',
      links: [
        { path: '/admin/login', label: 'Admin Login', desc: 'Dedicated administrator credential access' },
        { path: '/admin', label: 'Admin Dashboard Overview', desc: 'High-level system health, user totals, net volume' },
        { path: '/admin/users', label: 'Student User Management', desc: 'Search, filter, view details, and toggle active/disabled states' },
        { path: '/admin/categories', label: 'Default System Categories', desc: 'Configure university-wide default categories and icons' },
        { path: '/admin/tips', label: 'Curate Saving Tips', desc: 'Publish, edit, and adjust priority on campus saving tips' },
        { path: '/admin/announcements', label: 'Announcements Manager', desc: 'Broadcast campus financial notices and dates' },
        { path: '/admin/statistics', label: 'Macro Financial Analytics', desc: 'Cross-campus volume, top categories, and adoption metrics' },
      ],
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center space-y-3">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white">
          Application Sitemap & Architecture Directory
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
          Complete structural map of all endpoints, modules, and role scopes built for Campus Coin in full compliance with the university software specification.
        </p>
      </div>

      <div className="space-y-8">
        {sections.map((sec, idx) => {
          const Icon = sec.icon;
          return (
            <div
              key={idx}
              className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4"
            >
              <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100 dark:border-slate-800">
                <Icon className={`w-5 h-5 ${sec.color}`} />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">{sec.title}</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sec.links.map((link, lIdx) => (
                  <Link
                    key={lIdx}
                    to={link.path}
                    className="p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/60 border border-slate-100 dark:border-slate-800/50 transition-colors group flex items-start justify-between"
                  >
                    <div>
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors flex items-center gap-1.5">
                        <span>{link.label}</span>
                        <code className="text-[10px] font-mono font-normal text-slate-400">
                          {link.path}
                        </code>
                      </span>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        {link.desc}
                      </p>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-300 group-hover:text-brand-500 shrink-0 mt-0.5 ml-2 transition-colors" />
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

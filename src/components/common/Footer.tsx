import React from 'react';
import { Link } from 'react-router-dom';
import { Coins, Heart, Shield, Sparkles, BookOpen } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand & Purpose */}
          <div className="space-y-4 md:col-span-1">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-sm">
                <Coins className="w-4 h-4" />
              </div>
              <span className="font-bold text-lg text-slate-900 dark:text-white">Campus Coin</span>
            </Link>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Smart spending student style. Designed specifically for university students to track allowances, hostel costs, meal plans, and academic goals.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              <span>Built for college budgeting</span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
              Explore
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/" className="text-slate-600 dark:text-slate-400 hover:text-indigo-600 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/features" className="text-slate-600 dark:text-slate-400 hover:text-indigo-600 transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="text-slate-600 dark:text-slate-400 hover:text-indigo-600 transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-slate-600 dark:text-slate-400 hover:text-indigo-600 transition-colors">
                  About Campus Coin
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-slate-600 dark:text-slate-400 hover:text-indigo-600 transition-colors">
                  Support & Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Student Hub & SRS Sitemap */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
              Student System
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/dashboard" className="text-slate-600 dark:text-slate-400 hover:text-indigo-600 transition-colors">
                  Student Dashboard
                </Link>
              </li>
              <li>
                <Link to="/transactions" className="text-slate-600 dark:text-slate-400 hover:text-indigo-600 transition-colors">
                  Expense Tracker
                </Link>
              </li>
              <li>
                <Link to="/budgets" className="text-slate-600 dark:text-slate-400 hover:text-indigo-600 transition-colors">
                  Monthly Budgets
                </Link>
              </li>
              <li>
                <Link to="/reports" className="text-slate-600 dark:text-slate-400 hover:text-indigo-600 transition-colors">
                  Financial Reports
                </Link>
              </li>
              <li>
                <Link to="/sitemap" className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline flex items-center gap-1">
                  <span>Complete Sitemap</span>
                  <BookOpen className="w-3 h-3" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Admin & Security */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
              Administration & Trust
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/admin/login" className="text-slate-600 dark:text-slate-400 hover:text-indigo-600 transition-colors flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Admin Portal</span>
                </Link>
              </li>
              <li>
                <span className="text-slate-500 dark:text-slate-500">JWT Protected Session</span>
              </li>
              <li>
                <span className="text-slate-500 dark:text-slate-500">Zero Commercial Ads</span>
              </li>
              <li>
                <span className="text-slate-500 dark:text-slate-500">Student Privacy First</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <p>© {new Date().getFullYear()} Campus Coin. All rights reserved.</p>
          <div className="flex items-center gap-1 mt-2 sm:mt-0">
            <span>Crafted for student financial freedom</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
          </div>
        </div>
      </div>
    </footer>
  );
};

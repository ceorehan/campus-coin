import React from 'react';
import { Link } from 'react-router-dom';
import {
  Coins,
  ArrowRight,
  Sparkles,
  PieChart,
  ShieldCheck,
  TrendingUp,
  Receipt,
  Upload,
  CheckCircle2,
  GraduationCap,
  Bell,
  Compass,
} from 'lucide-react';

export const Home: React.FC = () => {
  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 sm:pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-semibold shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              <span>Smart Spending Student Style • Fall 2026 Edition</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.1]">
              Master your allowance.{' '}
              <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-500 bg-clip-text text-transparent">
                Crush campus life.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
              Campus Coin is designed exclusively for university students. Track monthly allowances, split hostel bills, budget cafe visits, and receive automated financial insights.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link
                to="/register"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl text-sm font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/25 hover:shadow-indigo-600/35 transition-all transform hover:-translate-y-0.5"
              >
                <span>Create Student Account</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/login"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl text-sm font-bold border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <span>Log In (Demo Ready)</span>
              </Link>
            </div>

            {/* Quick Demo Credentials Reminder */}
            <div className="pt-2">
              <div className="inline-flex flex-wrap items-center justify-center gap-2 px-4 py-2 rounded-2xl bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
                <span className="font-semibold text-slate-800 dark:text-slate-200">🚀 Quick Demo Access:</span>
                <span>Student: <code className="text-indigo-600 dark:text-indigo-400 font-mono">student@campuscoin.local / Student@12345</code></span>
                <span>•</span>
                <span>Admin: <code className="text-indigo-600 dark:text-indigo-400 font-mono">admin@campuscoin.local / Admin@12345</code></span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            Everything a Student Needs to Stay Solvent
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            No convoluted Wall Street jargon. Just real student priorities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 1 */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4">
              <Coins className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
              Allowance Baseline & Savings Goal
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Define your monthly financial cushion from family or part-time work, set a semester savings target, and see live progress toward your goal.
            </p>
          </div>

          {/* 2 */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
              <PieChart className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
              Category Budgets & 75% Alerts
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Set monthly spending caps for Food, Hostel, Transit, Subscriptions, and Academics. Campus Coin automatically triggers alerts at 75% and 100% capacity.
            </p>
          </div>

          {/* 3 */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
              AI Categorization & Monthly Digest
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Type "Starbucks latte" or "Calculus textbook" and let AI auto-assign the exact category. Get personalized monthly digests on where to save next.
            </p>
          </div>

          {/* 4 */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-4">
              <Upload className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
              One-Click CSV Statement Import
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Export statements from your student debit card or mobile wallet and bulk import them in seconds with instant validation and category mapping.
            </p>
          </div>

          {/* 5 */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 flex items-center justify-center mb-4">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
              Student Saving Tips & Bookmarks
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Learn practical university money hacks: library reserve books, student transit pass discounts, and bulk cooking ideas. Save favorites for later review.
            </p>
          </div>

          {/* 6 */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
              Admin & Campus Community Hub
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              University administrators can broadcast campus financial aid announcements, manage categories, curate saving tips, and review macro spending health.
            </p>
          </div>
        </div>
      </section>

      {/* SRS Sitemap Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 rounded-3xl bg-gradient-to-r from-indigo-900 to-slate-900 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-indigo-200">
              <GraduationCap className="w-4 h-4" />
              <span>Full SRS Compliance</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black">
              Looking for our structured application directory?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Explore the complete sitemap documenting all public, student, and administration endpoints as required by university specifications.
            </p>
          </div>
          <Link
            to="/sitemap"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-bold bg-white text-slate-900 hover:bg-indigo-50 transition-colors shrink-0 shadow-md"
          >
            <span>View Complete Sitemap</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
};

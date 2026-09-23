import React from 'react';
import { Link } from 'react-router-dom';
import {
  Coins,
  PieChart,
  Sparkles,
  Upload,
  Compass,
  Bell,
  Shield,
  FileSpreadsheet,
  ArrowRight,
} from 'lucide-react';

export const Features: React.FC = () => {
  const featuresList = [
    {
      icon: Coins,
      title: 'Monthly Allowance Baseline',
      desc: 'Set your recurring allowance or campus paycheck baseline. Campus Coin monitors whether your current run rate will leave you stranded before the end of the month.',
      color: 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400',
    },
    {
      icon: PieChart,
      title: 'Visual Category Budgets',
      desc: 'Configure flexible caps for Food, Transportation, Hostel/Rent, Academics, Subscriptions, and Entertainment. Progress indicators clearly show safe, near-limit, and exceeded states.',
      color: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400',
    },
    {
      icon: Bell,
      title: 'Automated 75% & 100% Threshold Alerts',
      desc: 'Never get surprised by an empty bank account. Campus Coin notifies you as soon as category spending hits 75% or exceeds 100% of your allocated budget.',
      color: 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400',
    },
    {
      icon: Sparkles,
      title: 'AI Smart Categorization & Insights',
      desc: 'Powered by Gemini AI, transactions are automatically categorized based on their description, with natural language summaries highlighting key spending patterns.',
      color: 'bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400',
    },
    {
      icon: Upload,
      title: 'Bulk CSV Statement Import',
      desc: 'Easily upload monthly statements from your bank, mobile wallet, or university card. Preview and confirm rows with intelligent automated error checking.',
      color: 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400',
    },
    {
      icon: FileSpreadsheet,
      title: 'CSV & PDF Financial Reports',
      desc: 'Generate monthly breakdowns, daily velocity charts, and 6-month historical spending trends with one-click export to CSV for your financial records.',
      color: 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400',
    },
    {
      icon: Compass,
      title: 'Campus Saving Tips & Bookmarks',
      desc: 'Curated financial hacks for university life—from splitting streaming plans to taking advantage of student ID discounts. Bookmark tips for quick access anytime.',
      color: 'bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400',
    },
    {
      icon: Shield,
      title: 'University Administration Portal',
      desc: 'Admins can publish official student notices, monitor overall student financial trends, configure default category taxonomies, and manage platform safety.',
      color: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
          Campus Coin Core Features
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Everything built into Campus Coin is designed to help university students make their allowance last longer and build positive financial habits.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {featuresList.map((f, i) => {
          const Icon = f.icon;
          return (
            <div
              key={i}
              className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className={`w-12 h-12 rounded-2xl ${f.color} flex items-center justify-center mb-4`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">{f.title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="text-center pt-8">
        <Link
          to="/register"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/25 transition-all"
        >
          <span>Get Started Now</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};

import React from 'react';
import { Coins, Heart, Target, Users, BookOpen } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-xs font-semibold">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Our Student Mission</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
          About Campus Coin
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          University life comes with unique financial realities: fixed family allowances, irregular part-time job hours, dorm fees, and unexpected textbook expenses. Campus Coin was born to solve these exact challenges.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto">
            <Coins className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Built for Students</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Tailored categories like Hostel/Rent, Campus Dining, and Course Textbooks instead of generic corporate buckets.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
            <Target className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Prevent Debt</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Proactive threshold warnings at 75% usage protect students from running out of money before the semester ends.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center mx-auto">
            <Users className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Community Driven</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Campus-curated money saving hacks, library reserves, and university financial aid notices in one unified portal.
          </p>
        </div>
      </div>

      <div className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          Privacy & Security by Design
        </h3>
        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          Campus Coin does not sell student financial data or serve third-party advertisements. All passwords are encrypted with bcrypt, sessions are guarded by authenticated JWT tokens, and students retain complete ownership over their transaction history.
        </p>
      </div>
    </div>
  );
};

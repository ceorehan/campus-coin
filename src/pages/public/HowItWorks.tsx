import React from 'react';
import { Link } from 'react-router-dom';
import { UserPlus, Wallet, Receipt, Sparkles, Award, ArrowRight } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      step: '01',
      icon: UserPlus,
      title: 'Create Your Student Profile',
      desc: 'Sign up with your university email, choose your academic year (Freshman through Senior), and specify your monthly allowance baseline and savings target.',
    },
    {
      step: '02',
      icon: Wallet,
      title: 'Set Monthly Category Budgets',
      desc: 'Allocate spending caps for Food, Transportation, Hostel/Rent, Academics, Subscriptions, and Entertainment. Budgets give you clear boundaries from day one.',
    },
    {
      step: '03',
      icon: Receipt,
      title: 'Log or Import Transactions',
      desc: 'Quickly enter daily costs via our "+ Add Expense" interface or drag-and-drop your bank CSV statement. Let AI automatically suggest the right category.',
    },
    {
      step: '04',
      icon: Sparkles,
      title: 'Receive Proactive Alerts & AI Insights',
      desc: 'Get alerted before you blow through your food budget at 75% usage. Check your AI financial digest at month-end to understand where you can save next.',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
          How Campus Coin Works
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Four straightforward steps from financial stress to semester-long confidence.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {steps.map((s, idx) => {
          const Icon = s.icon;
          return (
            <div
              key={idx}
              className="relative p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between"
            >
              <div>
                <span className="text-3xl font-black text-indigo-100 dark:text-indigo-950/80 block mb-2">
                  {s.step}
                </span>
                <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-3">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">{s.title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{s.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-8 rounded-3xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/40 text-center space-y-4 max-w-2xl mx-auto">
        <Award className="w-8 h-8 text-indigo-600 dark:text-indigo-400 mx-auto" />
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          Ready to take control of your student budget?
        </h3>
        <p className="text-xs text-slate-600 dark:text-slate-400">
          Join thousands of university students using Campus Coin to graduate without financial stress.
        </p>
        <Link
          to="/register"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-colors"
        >
          <span>Create Free Account</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};

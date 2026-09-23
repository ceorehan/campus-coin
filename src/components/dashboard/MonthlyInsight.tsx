import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Lightbulb } from 'lucide-react';

interface MonthlyInsightProps {
  insight: {
    summaryText: string;
    tipText: string;
    month?: string;
    topCategory?: string;
  } | null;
}

export const MonthlyInsightCard: React.FC<MonthlyInsightProps> = ({ insight }) => {
  if (!insight) {
    return (
      <div className="p-5 rounded-3xl bg-gradient-to-br from-indigo-50/70 to-purple-50/70 dark:from-indigo-950/30 dark:to-slate-900 border border-indigo-100 dark:border-indigo-900/40 text-center">
        <Sparkles className="w-6 h-6 text-indigo-500 mx-auto mb-2" />
        <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
          No Monthly AI Insights yet
        </p>
        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 mb-3">
          Campus Coin analyzes your spending habits to provide actionable recommendations.
        </p>
        <Link
          to="/insights"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-colors"
        >
          Generate Insight
        </Link>
      </div>
    );
  }

  return (
    <div className="p-5 rounded-3xl bg-gradient-to-br from-indigo-50/70 via-purple-50/50 to-pink-50/40 dark:from-indigo-950/40 dark:via-purple-950/20 dark:to-slate-900 border border-indigo-100 dark:border-indigo-900/50 relative overflow-hidden transition-colors">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-400">
          <Sparkles className="w-4 h-4" />
          <span className="text-xs font-bold uppercase tracking-wider">AI Financial Digest</span>
        </div>
        {insight.topCategory && (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300">
            Top Spend: {insight.topCategory}
          </span>
        )}
      </div>

      <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
        {insight.summaryText}
      </p>

      {insight.tipText && (
        <div className="mt-3 p-3 rounded-2xl bg-white/70 dark:bg-slate-800/70 border border-indigo-100 dark:border-indigo-900/30 flex items-start gap-2.5">
          <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-tight">
            {insight.tipText}
          </p>
        </div>
      )}

      <div className="mt-3 text-right">
        <Link
          to="/insights"
          className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          <span>View historical insights</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};

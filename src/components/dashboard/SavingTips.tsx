import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Bookmark, ArrowRight } from 'lucide-react';
import { formatCurrency } from '../../utils/formatCurrency';

interface TipItem {
  _id: string;
  title: string;
  description: string;
  category: string;
  potentialSavingImpact: number;
}

interface SavingTipsCardProps {
  tips: TipItem[];
  currency?: string;
  onBookmark?: (id: string) => void;
}

export const SavingTipsCard: React.FC<SavingTipsCardProps> = ({
  tips,
  currency = 'USD',
  onBookmark,
}) => {
  if (!tips || tips.length === 0) {
    return (
      <div className="py-6 text-center text-xs text-slate-400">
        No new tips at the moment. Keep logging transactions to get student recommendations.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tips.map((tip) => (
        <div
          key={tip._id}
          className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:border-brand-100 dark:hover:border-brand-900 transition-colors"
        >
          <div className="flex items-start justify-between gap-2">
            <div>
              <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 mb-1">
                {tip.category}
              </span>
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100">{tip.title}</h4>
            </div>
            {tip.potentialSavingImpact > 0 && (
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 whitespace-nowrap bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
                Save ~{formatCurrency(tip.potentialSavingImpact, currency)}
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
            {tip.description}
          </p>
        </div>
      ))}

      <div className="pt-1 text-center">
        <Link
          to="/saving-tips"
          className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline"
        >
          <span>Explore all student saving tips</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};

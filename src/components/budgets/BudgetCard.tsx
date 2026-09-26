import React from 'react';
import { Edit2, Trash2, AlertCircle, AlertTriangle, CheckCircle } from 'lucide-react';
import { formatCurrency } from '../../utils/formatCurrency';

interface BudgetCardProps {
  budget: {
    _id: string;
    category: {
      _id: string;
      name: string;
      color?: string;
    };
    limitAmount: number;
    spent: number;
    remaining: number;
    usage: number;
    status: 'Safe' | 'Near Limit' | 'Exceeded';
  };
  onEdit: (b: any) => void;
  onDelete: (id: string) => void;
  currency?: string;
}

export const BudgetCard: React.FC<BudgetCardProps> = ({
  budget,
  onEdit,
  onDelete,
  currency = 'USD',
}) => {
  const isExceeded = budget.status === 'Exceeded';
  const isNearLimit = budget.status === 'Near Limit';

  const badgeColor = isExceeded
    ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300'
    : isNearLimit
    ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'
    : 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300';

  const barColor = isExceeded ? 'bg-rose-600' : isNearLimit ? 'bg-amber-500' : 'bg-emerald-500';

  return (
    <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition-all">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2.5">
          <span
            className="w-3.5 h-3.5 rounded-full"
            style={{ backgroundColor: budget.category?.color || '#6366f1' }}
          />
          <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">
            {budget.category?.name}
          </h4>
        </div>

        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${badgeColor}`}>
          {budget.status} ({budget.usage}%)
        </span>
      </div>

      {/* Figures */}
      <div className="mt-4 flex items-baseline justify-between text-xs">
        <div>
          <span className="text-slate-400 block text-[10px] uppercase font-semibold">Spent</span>
          <span className="text-base font-black text-slate-900 dark:text-white">
            {formatCurrency(budget.spent, currency)}
          </span>
        </div>
        <div className="text-right">
          <span className="text-slate-400 block text-[10px] uppercase font-semibold">Budget Limit</span>
          <span className="text-base font-black text-slate-900 dark:text-white">
            {formatCurrency(budget.limitAmount, currency)}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-3 w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${barColor}`}
          style={{ width: `${Math.min(100, budget.usage)}%` }}
        />
      </div>

      {/* Remaining & Actions */}
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
        <span className="text-slate-500 dark:text-slate-400 text-[11px]">
          {isExceeded ? (
            <span className="text-rose-600 dark:text-rose-400 font-bold">
              Over by {formatCurrency(budget.spent - budget.limitAmount, currency)}
            </span>
          ) : (
            <span>
              Remaining: <strong>{formatCurrency(budget.remaining, currency)}</strong>
            </span>
          )}
        </span>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(budget)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-brand-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Edit limit"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDelete(budget._id)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
            title="Delete budget"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

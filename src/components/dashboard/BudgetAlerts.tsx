import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, AlertTriangle, ArrowRight } from 'lucide-react';
import { formatCurrency } from '../../utils/formatCurrency';

interface BudgetAlertItem {
  budgetId: string;
  category: string;
  color?: string;
  limitAmount: number;
  spent: number;
  usage: number;
  status: 'Safe' | 'Near Limit' | 'Exceeded';
}

interface BudgetAlertsProps {
  alerts: BudgetAlertItem[];
  currency?: string;
}

export const BudgetAlerts: React.FC<BudgetAlertsProps> = ({ alerts, currency = 'USD' }) => {
  if (!alerts || alerts.length === 0) {
    return (
      <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center shrink-0 text-emerald-600 dark:text-emerald-400">
          ✓
        </div>
        <div>
          <span className="font-bold block">All Budgets on Track!</span>
          <span className="text-[11px] opacity-90">
            Great job! You haven't exceeded or neared limits on any category this month.
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {alerts.map((alert, idx) => {
        const isExceeded = alert.status === 'Exceeded';
        return (
          <div
            key={idx}
            className={`p-3.5 rounded-2xl border transition-colors ${
              isExceeded
                ? 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900/50 text-rose-900 dark:text-rose-200'
                : 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/50 text-amber-900 dark:text-amber-200'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                {isExceeded ? (
                  <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                )}
                <span className="text-xs font-bold">{alert.category}</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    isExceeded
                      ? 'bg-rose-200 dark:bg-rose-900 text-rose-800 dark:text-rose-200'
                      : 'bg-amber-200 dark:bg-amber-900 text-amber-800 dark:text-amber-200'
                  }`}
                >
                  {alert.usage}% Used
                </span>
              </div>
              <span className="text-xs font-bold whitespace-nowrap">
                {formatCurrency(alert.spent, currency)} / {formatCurrency(alert.limitAmount, currency)}
              </span>
            </div>

            <div className="mt-2 w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${isExceeded ? 'bg-rose-600' : 'bg-amber-500'}`}
                style={{ width: `${Math.min(100, alert.usage)}%` }}
              />
            </div>
          </div>
        );
      })}

      <div className="pt-1 text-right">
        <Link
          to="/budgets"
          className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline"
        >
          <span>Manage all budgets</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};

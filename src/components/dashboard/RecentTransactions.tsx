import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ArrowDownRight, ArrowRight } from 'lucide-react';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';

interface RecentTransactionsProps {
  transactions: any[];
  currency?: string;
}

export const RecentTransactions: React.FC<RecentTransactionsProps> = ({
  transactions,
  currency = 'USD',
}) => {
  if (!transactions || transactions.length === 0) {
    return (
      <div className="py-8 text-center text-xs text-slate-400">
        No recent transactions found. Click "+ Add Transaction" to start!
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {transactions.map((t) => {
        const isIncome = t.type === 'income';
        const categoryColor = t.categoryId?.color || (isIncome ? '#10b981' : '#f43f5e');

        return (
          <div
            key={t._id}
            className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/60 border border-slate-100 dark:border-slate-800/50 transition-colors"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-white font-bold"
                style={{ backgroundColor: categoryColor }}
              >
                {isIncome ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                  {t.description}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] text-slate-400">
                    {formatDate(t.date, 'short')}
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium truncate">
                    • {t.categoryId?.name || 'General'}
                  </span>
                </div>
              </div>
            </div>

            <div className="text-right shrink-0 ml-3">
              <p
                className={`text-xs font-bold ${
                  isIncome ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-slate-100'
                }`}
              >
                {isIncome ? '+' : '-'}{formatCurrency(t.amount, currency)}
              </p>
            </div>
          </div>
        );
      })}

      <div className="pt-2 text-center">
        <Link
          to="/transactions"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline"
        >
          <span>View all transactions</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};

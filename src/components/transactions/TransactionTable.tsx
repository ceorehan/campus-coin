import React from 'react';
import { Edit2, Trash2, ArrowUpRight, ArrowDownRight, Repeat } from 'lucide-react';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';

interface TransactionTableProps {
  transactions: any[];
  onEdit: (t: any) => void;
  onDelete: (id: string) => void;
  currency?: string;
}

export const TransactionTable: React.FC<TransactionTableProps> = ({
  transactions,
  onEdit,
  onDelete,
  currency = 'USD',
}) => {
  if (!transactions || transactions.length === 0) {
    return (
      <div className="py-12 text-center text-xs text-slate-400">
        No transactions match your current search or filters.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs">
        <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 uppercase tracking-wider font-semibold">
          <tr>
            <th className="px-4 py-3">Category</th>
            <th className="px-4 py-3">Description</th>
            <th className="px-4 py-3">Date</th>
            <th className="px-4 py-3">Type</th>
            <th className="px-4 py-3 text-right">Amount</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {transactions.map((t) => {
            const isIncome = t.type === 'income';
            const catName = t.categoryId?.name || 'General';
            const catColor = t.categoryId?.color || (isIncome ? '#10b981' : '#f43f5e');

            return (
              <tr
                key={t._id}
                className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
              >
                {/* Category badge */}
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: catColor }}
                    />
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {catName}
                    </span>
                  </div>
                </td>

                {/* Description & tags */}
                <td className="px-4 py-3 max-w-xs">
                  <div className="font-medium text-slate-800 dark:text-slate-200 truncate">
                    {t.description}
                  </div>
                  {t.isRecurring && (
                    <span className="inline-flex items-center gap-1 mt-0.5 text-[10px] font-semibold text-indigo-600 dark:text-indigo-400">
                      <Repeat className="w-2.5 h-2.5" />
                      <span>Recurring ({t.recurringFrequency})</span>
                    </span>
                  )}
                </td>

                {/* Date */}
                <td className="px-4 py-3 whitespace-nowrap text-slate-500 dark:text-slate-400">
                  {formatDate(t.date, 'short')}
                </td>

                {/* Type Badge */}
                <td className="px-4 py-3 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      isIncome
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                        : 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300'
                    }`}
                  >
                    {isIncome ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    <span>{isIncome ? 'Income' : 'Expense'}</span>
                  </span>
                </td>

                {/* Amount */}
                <td className="px-4 py-3 whitespace-nowrap text-right font-bold">
                  <span
                    className={
                      isIncome
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-slate-900 dark:text-slate-100'
                    }
                  >
                    {isIncome ? '+' : '-'}{formatCurrency(t.amount, currency)}
                  </span>
                </td>

                {/* Actions */}
                <td className="px-4 py-3 whitespace-nowrap text-right space-x-1">
                  <button
                    onClick={() => onEdit(t)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title="Edit transaction"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onDelete(t._id)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
                    title="Delete transaction"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

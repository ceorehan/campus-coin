import React, { useState } from 'react';
import { DollarSign, Loader2 } from 'lucide-react';
import { isValidAmount } from '../../utils/validators';

interface BudgetFormProps {
  categories: any[];
  initialData?: any;
  currentMonth: string;
  onSubmit: (data: { categoryId: string; limitAmount: number; month: string }) => Promise<void>;
  onCancel?: () => void;
  loading?: boolean;
}

export const BudgetForm: React.FC<BudgetFormProps> = ({
  categories,
  initialData,
  currentMonth,
  onSubmit,
  onCancel,
  loading = false,
}) => {
  const [categoryId, setCategoryId] = useState<string>(
    initialData?.category?._id || initialData?.categoryId || (categories[0]?._id ?? '')
  );
  const [limitAmount, setLimitAmount] = useState<string>(
    initialData?.limitAmount ? String(initialData.limitAmount) : ''
  );
  const [month, setMonth] = useState<string>(initialData?.month || currentMonth);
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryId) {
      setError('Please select an expense category');
      return;
    }
    if (!isValidAmount(limitAmount)) {
      setError('Please specify a positive budget limit amount');
      return;
    }

    try {
      setError('');
      await onSubmit({
        categoryId,
        limitAmount: Number(limitAmount),
        month,
      });
    } catch (err: any) {
      setError(err.message || 'Failed to save budget');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-300 text-xs">
          {error}
        </div>
      )}

      {/* Category selector */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
          Category
        </label>
        <select
          value={categoryId}
          disabled={!!initialData}
          onChange={(e) => setCategoryId(e.target.value)}
          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-brand-500 outline-none disabled:opacity-60"
        >
          {categories.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Month */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
          Budget Month (YYYY-MM)
        </label>
        <input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-brand-500 outline-none"
        />
      </div>

      {/* Limit Amount */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
          Monthly Limit Amount
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <DollarSign className="w-4 h-4" />
          </div>
          <input
            type="number"
            step="0.01"
            min="1"
            required
            placeholder="e.g. 20000"
            value={limitAmount}
            onChange={(e) => setLimitAmount(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm font-semibold focus:ring-2 focus:ring-brand-500 outline-none"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-xs disabled:opacity-50 transition-colors"
        >
          {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
          <span>{initialData ? 'Update Limit' : 'Set Budget'}</span>
        </button>
      </div>
    </form>
  );
};

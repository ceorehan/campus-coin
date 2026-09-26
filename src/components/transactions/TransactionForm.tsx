import React, { useState, useEffect } from 'react';
import { Sparkles, Loader2, Calendar, DollarSign, Tag, RefreshCw } from 'lucide-react';
import { categoryService } from '../../services/categoryService';
import { isValidAmount } from '../../utils/validators';

interface TransactionFormProps {
  initialData?: any;
  onSubmit: (formData: any) => Promise<void>;
  onCancel?: () => void;
  loading?: boolean;
}

export const TransactionForm: React.FC<TransactionFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  loading = false,
}) => {
  const [type, setType] = useState<'expense' | 'income'>(initialData?.type || 'expense');
  const [amount, setAmount] = useState<string>(initialData?.amount ? String(initialData.amount) : '');
  const [categoryId, setCategoryId] = useState<string>(
    initialData?.categoryId?._id || initialData?.categoryId || ''
  );
  const [description, setDescription] = useState<string>(initialData?.description || '');
  const [date, setDate] = useState<string>(
    initialData?.date
      ? new Date(initialData.date).toISOString().slice(0, 10)
      : new Date().toISOString().slice(0, 10)
  );
  const [isRecurring, setIsRecurring] = useState<boolean>(initialData?.isRecurring || false);
  const [recurringFrequency, setRecurringFrequency] = useState<string>(
    initialData?.recurringFrequency || 'monthly'
  );

  const [categories, setCategories] = useState<any[]>([]);
  const [suggesting, setSuggesting] = useState<boolean>(false);
  const [aiSuggestion, setAiSuggestion] = useState<any>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    fetchCategories();
  }, [type]);

  const fetchCategories = async () => {
    try {
      const res = await categoryService.getCategories(type);
      if (res.success && res.data) {
        setCategories(res.data);
        if (!categoryId && res.data.length > 0 && !initialData) {
          setCategoryId(res.data[0]._id);
        }
      }
    } catch (err) {
      console.error('Failed to load categories');
    }
  };

  const handleAISuggest = async () => {
    if (!description.trim()) {
      setError('Please type a description first (e.g., "Campus cafeteria dinner" or "Math tutoring")');
      return;
    }
    try {
      setError('');
      setSuggesting(true);
      const res = await categoryService.suggestCategory(description, type);
      if (res.success && res.data) {
        setAiSuggestion(res.data);
        if (res.data.categoryId) {
          setCategoryId(res.data.categoryId);
        }
      }
    } catch (err: any) {
      setError(err.message || 'AI suggestion failed');
    } finally {
      setSuggesting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidAmount(amount)) {
      setError('Please enter a valid positive amount');
      return;
    }
    if (!categoryId) {
      setError('Please select a category');
      return;
    }
    if (!description.trim()) {
      setError('Please enter a description');
      return;
    }

    try {
      setError('');
      await onSubmit({
        type,
        amount: Number(amount),
        categoryId,
        description: description.trim(),
        date: new Date(date).toISOString(),
        isRecurring,
        recurringFrequency: isRecurring ? recurringFrequency : 'none',
        aiSuggestedCategoryId: aiSuggestion?.categoryId || null,
      });
    } catch (err: any) {
      setError(err.message || 'Failed to save transaction');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-300 text-xs">
          {error}
        </div>
      )}

      {/* Type Selector (Expense vs Income) */}
      <div className="flex p-1 rounded-2xl bg-slate-100 dark:bg-slate-800">
        <button
          type="button"
          onClick={() => {
            setType('expense');
            setCategoryId('');
          }}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
            type === 'expense'
              ? 'bg-white dark:bg-slate-900 text-rose-600 shadow-xs'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          Expense (-)
        </button>
        <button
          type="button"
          onClick={() => {
            setType('income');
            setCategoryId('');
          }}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
            type === 'income'
              ? 'bg-white dark:bg-slate-900 text-emerald-600 shadow-xs'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          Income (+)
        </button>
      </div>

      {/* Amount Input */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
          Amount
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <DollarSign className="w-4 h-4" />
          </div>
          <input
            type="number"
            step="0.01"
            min="0"
            required
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm font-semibold focus:ring-2 focus:ring-brand-500 outline-none"
          />
        </div>
      </div>

      {/* Description Input with AI Category Suggest button */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Description
          </label>
          <button
            type="button"
            onClick={handleAISuggest}
            disabled={suggesting || !description.trim()}
            className="inline-flex items-center gap-1 text-[11px] font-bold text-brand-600 dark:text-brand-400 hover:underline disabled:opacity-50"
            title="Auto-detect category from description"
          >
            {suggesting ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Sparkles className="w-3.5 h-3.5" />
            )}
            <span>AI Suggest Category</span>
          </button>
        </div>
        <input
          type="text"
          required
          placeholder="e.g. Subway sandwich, Monthly bus card, Physics textbook"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-brand-500 outline-none"
        />

        {aiSuggestion && (
          <div className="mt-1.5 p-2 rounded-xl bg-brand-50 dark:bg-brand-950/40 border border-brand-100 dark:border-brand-900/40 flex items-center justify-between text-[11px] text-brand-700 dark:text-brand-300">
            <span>
              AI Suggested Category: <strong>{aiSuggestion.category}</strong>
            </span>
            <span className="text-[10px] font-semibold opacity-75">
              Confidence: {Math.round(aiSuggestion.confidence * 100)}%
            </span>
          </div>
        )}
      </div>

      {/* Category Dropdown */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
          Category
        </label>
        <div className="relative">
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-brand-500 outline-none appearance-none"
          >
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name} {!c.isDefault ? '(Custom)' : ''}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Date Picker */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
          Date
        </label>
        <div className="relative">
          <input
            type="date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-brand-500 outline-none"
          />
        </div>
      </div>

      {/* Recurring Checkbox & Frequency */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={isRecurring}
            onChange={(e) => setIsRecurring(e.target.checked)}
            className="w-4 h-4 rounded-md text-brand-600 focus:ring-brand-500 border-slate-300 dark:border-slate-700"
          />
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Mark as Recurring Transaction
          </span>
        </label>

        {isRecurring && (
          <div className="mt-2 pl-6">
            <label className="block text-[11px] text-slate-500 mb-1">Frequency</label>
            <select
              value={recurringFrequency}
              onChange={(e) => setRecurringFrequency(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-md shadow-brand-500/20 transition-all disabled:opacity-50"
        >
          {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
          <span>{initialData ? 'Update Transaction' : 'Save Transaction'}</span>
        </button>
      </div>
    </form>
  );
};

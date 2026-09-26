import React from 'react';
import { Search, Filter, RotateCcw } from 'lucide-react';

interface TransactionFilterProps {
  search: string;
  onSearchChange: (val: string) => void;
  type: string;
  onTypeChange: (val: string) => void;
  categoryId: string;
  onCategoryChange: (val: string) => void;
  categories: any[];
  startDate: string;
  onStartDateChange: (val: string) => void;
  endDate: string;
  onEndDateChange: (val: string) => void;
  sortBy: string;
  onSortByChange: (val: string) => void;
  onReset: () => void;
}

export const TransactionFilter: React.FC<TransactionFilterProps> = ({
  search,
  onSearchChange,
  type,
  onTypeChange,
  categoryId,
  onCategoryChange,
  categories,
  startDate,
  onStartDateChange,
  endDate,
  onEndDateChange,
  sortBy,
  onSortByChange,
  onReset,
}) => {
  return (
    <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
      {/* Top Search bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          placeholder="Search by description (e.g. coffee, textbooks, allowance)..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 text-xs focus:ring-2 focus:ring-brand-500 outline-none"
        />
      </div>

      {/* Filter Row */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1">
        {/* Type Filter */}
        <div>
          <select
            value={type}
            onChange={(e) => onTypeChange(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-xs focus:ring-2 focus:ring-brand-500 outline-none"
          >
            <option value="">All Types</option>
            <option value="expense">Expenses Only</option>
            <option value="income">Income Only</option>
          </select>
        </div>

        {/* Category Filter */}
        <div>
          <select
            value={categoryId}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-xs focus:ring-2 focus:ring-brand-500 outline-none"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Start Date */}
        <div>
          <input
            type="date"
            placeholder="From Date"
            value={startDate}
            onChange={(e) => onStartDateChange(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-xs focus:ring-2 focus:ring-brand-500 outline-none"
          />
        </div>

        {/* End Date */}
        <div>
          <input
            type="date"
            placeholder="To Date"
            value={endDate}
            onChange={(e) => onEndDateChange(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-xs focus:ring-2 focus:ring-brand-500 outline-none"
          />
        </div>

        {/* Sort & Reset */}
        <div className="flex items-center gap-1.5 col-span-2 sm:col-span-1">
          <select
            value={sortBy}
            onChange={(e) => onSortByChange(e.target.value)}
            className="flex-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-xs focus:ring-2 focus:ring-brand-500 outline-none"
          >
            <option value="date">Newest Date</option>
            <option value="amount">Amount</option>
          </select>

          <button
            onClick={onReset}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0"
            title="Reset Filters"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { budgetService } from '../../services/budgetService';
import { categoryService } from '../../services/categoryService';
import { useTheme } from '../../context/ThemeContext';
import { BudgetCard } from '../../components/budgets/BudgetCard';
import { BudgetForm } from '../../components/budgets/BudgetForm';
import { Modal } from '../../components/common/Modal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { Loader } from '../../components/common/Loader';
import { EmptyState } from '../../components/common/EmptyState';
import { PieChart, Plus, Calendar, AlertTriangle } from 'lucide-react';
import { formatCurrency } from '../../utils/formatCurrency';

export const Budgets: React.FC = () => {
  const { currency } = useTheme();

  const currentYearMonth = new Date().toISOString().slice(0, 7);
  const [selectedMonth, setSelectedMonth] = useState<string>(currentYearMonth);
  const [budgets, setBudgets] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>({ totalLimit: 0, totalSpent: 0, totalRemaining: 0 });
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editBudget, setEditBudget] = useState<any>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchCategories = async () => {
    try {
      const res = await categoryService.getCategories('expense');
      if (res.success && res.data) {
        setCategories(res.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchBudgets = async () => {
    try {
      setLoading(true);
      const res = await budgetService.getBudgets(selectedMonth);
      if (res.success && res.data) {
        setBudgets(res.data.budgets);
        setSummary(res.data.summary);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchBudgets();
  }, [selectedMonth]);

  const handleOpenCreate = () => {
    setEditBudget(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (b: any) => {
    setEditBudget(b);
    setIsModalOpen(true);
  };

  const handleSaveBudget = async (data: { categoryId: string; limitAmount: number; month: string }) => {
    try {
      setSaving(true);
      await budgetService.setBudget(data);
      setIsModalOpen(false);
      setEditBudget(null);
      fetchBudgets();
    } catch (err: any) {
      alert(err.message || 'Failed to save budget');
    } finally {
      setSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    try {
      await budgetService.deleteBudget(deleteId);
      setDeleteId(null);
      fetchBudgets();
    } catch (err: any) {
      alert(err.message || 'Failed to remove budget');
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header and Month Picker */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Monthly Category Budgets
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Configure spending boundaries and get proactively alerted at 75% threshold
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs shadow-xs">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-transparent outline-none font-semibold text-slate-700 dark:text-slate-300"
            />
          </div>

          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Set Category Budget</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Total Budgeted Cap
          </span>
          <span className="text-2xl font-black text-slate-900 dark:text-white">
            {formatCurrency(summary.totalLimit, currency)}
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Actual Spent
          </span>
          <span className="text-2xl font-black text-rose-600 dark:text-rose-400">
            {formatCurrency(summary.totalSpent, currency)}
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Total Remaining
          </span>
          <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
            {formatCurrency(summary.totalRemaining, currency)}
          </span>
        </div>
      </div>

      {/* Budgets Grid */}
      {loading ? (
        <Loader message="Recalculating category limits..." />
      ) : budgets.length === 0 ? (
        <EmptyState
          icon={PieChart}
          title="No Budgets Set for this Month"
          description="Setting a budget for Food, Academics, or Transit helps you pace your allowance across the semester."
          actionLabel="Set Your First Budget"
          onAction={handleOpenCreate}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {budgets.map((b) => (
            <BudgetCard
              key={b._id}
              budget={b}
              onEdit={handleOpenEdit}
              onDelete={(id) => setDeleteId(id)}
              currency={currency}
            />
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editBudget ? 'Update Budget Limit' : 'Set Category Budget Limit'}
      >
        <BudgetForm
          categories={categories}
          initialData={editBudget}
          currentMonth={selectedMonth}
          onSubmit={handleSaveBudget}
          onCancel={() => setIsModalOpen(false)}
          loading={saving}
        />
      </Modal>

      {/* Delete Dialog */}
      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleConfirmDelete}
        title="Remove Budget Limit"
        message="Are you sure you want to remove this budget? You will no longer receive 75% threshold warnings for this category."
        confirmLabel="Remove"
        isDestructive={true}
      />
    </div>
  );
};

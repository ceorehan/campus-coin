import React, { useState, useEffect } from 'react';
import { categoryService } from '../../services/categoryService';
import { Modal } from '../../components/common/Modal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { Loader } from '../../components/common/Loader';
import { Tag, Plus, Edit2, Trash2, Sparkles, Loader2 } from 'lucide-react';

export const Categories: React.FC = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState<'all' | 'expense' | 'income'>('all');

  // Create/Edit Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [editId, setEditId] = useState<string | null>(null);
  const [formData, setFormData] = useState<{
    name: string;
    type: 'expense' | 'income';
    color: string;
    icon: string;
  }>({
    name: '',
    type: 'expense',
    color: '#6366f1',
    icon: 'Tag',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Delete Dialog
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // AI live test
  const [testDescription, setTestDescription] = useState('');
  const [testResult, setTestResult] = useState<any>(null);
  const [testingAI, setTestingAI] = useState(false);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await categoryService.getCategories(typeFilter === 'all' ? undefined : typeFilter);
      if (res.success && res.data) {
        setCategories(res.data);
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [typeFilter]);

  const handleOpenCreate = () => {
    setModalMode('create');
    setEditId(null);
    setFormData({ name: '', type: 'expense', color: '#6366f1', icon: 'Tag' });
    setError('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cat: any) => {
    setModalMode('edit');
    setEditId(cat._id);
    setFormData({
      name: cat.name,
      type: cat.type,
      color: cat.color || '#6366f1',
      icon: cat.icon || 'Tag',
    });
    setError('');
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError('Please provide a category name');
      return;
    }

    try {
      setSaving(true);
      setError('');
      if (modalMode === 'create') {
        await categoryService.createCategory(formData);
      } else if (editId) {
        await categoryService.updateCategory(editId, formData);
      }
      setIsModalOpen(false);
      fetchCategories();
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Operation failed');
    } finally {
      setSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    try {
      await categoryService.deleteCategory(deleteId);
      setDeleteId(null);
      fetchCategories();
    } catch (err: any) {
      alert(err.response?.data?.message || err.message || 'Failed to delete category');
    }
  };

  const handleTestAI = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testDescription.trim()) return;
    try {
      setTestingAI(true);
      const res = await categoryService.suggestCategory(testDescription);
      if (res.success) {
        setTestResult(res.data);
      }
    } catch (err: any) {
      alert(err.message || 'AI testing failed');
    } finally {
      setTestingAI(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Categories & Taxonomies
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Default university categories plus your own custom student tags
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-md shadow-brand-500/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>New Custom Category</span>
        </button>
      </div>

      {/* AI Suggestion Sandbox preview widget */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-brand-50 via-purple-50 to-pink-50 dark:from-brand-950/40 dark:via-purple-950/20 dark:to-slate-900 border border-brand-100 dark:border-brand-900/40">
        <div className="flex items-center gap-2 text-brand-700 dark:text-brand-300 text-xs font-bold mb-2">
          <Sparkles className="w-4 h-4" />
          <span>Gemini AI Category Sandbox</span>
        </div>
        <p className="text-[11px] text-slate-600 dark:text-slate-400 mb-3">
          Type any random student transaction description below to test our neural classifier.
        </p>
        <form onSubmit={handleTestAI} className="flex gap-2">
          <input
            type="text"
            placeholder="e.g. 3 printed copies of biology lab report or midnight noodle bowl"
            value={testDescription}
            onChange={(e) => setTestDescription(e.target.value)}
            className="flex-1 px-3.5 py-2 rounded-xl border border-brand-200 dark:border-brand-800 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-brand-500"
          />
          <button
            type="submit"
            disabled={testingAI}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-xs disabled:opacity-50 inline-flex items-center gap-1.5 shrink-0"
          >
            {testingAI && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            <span>Classify</span>
          </button>
        </form>

        {testResult && (
          <div className="mt-3 p-3 rounded-2xl bg-white dark:bg-slate-900 border border-brand-100 dark:border-brand-900/50 flex items-center justify-between text-xs">
            <span>
              Predicted Category: <strong className="text-brand-600 dark:text-brand-400">{testResult.category}</strong>
            </span>
            <span className="text-[10px] text-slate-500">
              Confidence Score: {Math.round(testResult.confidence * 100)}%
            </span>
          </div>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        {(['all', 'expense', 'income'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTypeFilter(t)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize transition-colors ${
              typeFilter === t
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-50'
            }`}
          >
            {t === 'all' ? 'All Categories' : `${t}s`}
          </button>
        ))}
      </div>

      {/* Categories Grid */}
      {loading ? (
        <Loader message="Loading categories..." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((c) => (
            <div
              key={c._id}
              className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition-all flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-2xl flex items-center justify-center text-white font-bold shrink-0 shadow-xs"
                  style={{ backgroundColor: c.color || '#6366f1' }}
                >
                  <Tag className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">{c.name}</h4>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span
                      className={`text-[10px] font-bold uppercase ${
                        c.type === 'income' ? 'text-emerald-600' : 'text-rose-600'
                      }`}
                    >
                      {c.type}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      • {c.isDefault ? 'Default' : 'Custom'}
                    </span>
                  </div>
                </div>
              </div>

              {!c.isDefault && (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(c)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-brand-600 transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setDeleteId(c._id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalMode === 'create' ? 'Create Custom Category' : 'Edit Category'}
      >
        <form onSubmit={handleSave} className="space-y-4">
          {error && (
            <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 text-xs">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Category Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Gym Membership, Laundry, Hackathons"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Category Type
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as 'expense' | 'income' })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Color Code
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                className="w-10 h-10 rounded-xl cursor-pointer border border-slate-200 dark:border-slate-800 p-0.5"
              />
              <span className="font-mono text-xs text-slate-600 dark:text-slate-400">
                {formData.color}
              </span>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-xs disabled:opacity-50 transition-colors"
            >
              {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>{modalMode === 'create' ? 'Create' : 'Save'}</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Dialog */}
      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Custom Category"
        message="Are you sure you want to delete this category? Transactions using this category will remain, but will show as general."
        confirmLabel="Delete"
        isDestructive={true}
      />
    </div>
  );
};

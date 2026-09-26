import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { CategoryTable } from '../../components/admin/CategoryTable';
import { Modal } from '../../components/common/Modal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { Loader } from '../../components/common/Loader';
import { Plus, Tag } from 'lucide-react';

export const AdminCategories: React.FC = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'expense',
    color: '#6366f1',
    icon: 'Tag',
  });
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await adminService.getDefaultCategories();
      if (res.success && res.data) {
        setCategories(res.data);
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

  const handleOpenCreate = () => {
    setEditId(null);
    setFormData({ name: '', type: 'expense', color: '#6366f1', icon: 'Tag' });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cat: any) => {
    setEditId(cat._id);
    setFormData({
      name: cat.name,
      type: cat.type,
      color: cat.color || '#6366f1',
      icon: cat.icon || 'Tag',
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editId) {
        await adminService.updateDefaultCategory(editId, formData);
      } else {
        await adminService.createDefaultCategory(formData);
      }
      setIsModalOpen(false);
      fetchCategories();
    } catch (err: any) {
      alert(err.message || 'Save failed');
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    try {
      await adminService.deleteDefaultCategory(deleteId);
      setDeleteId(null);
      fetchCategories();
    } catch (err: any) {
      alert(err.message || 'Delete failed');
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Default System Categories
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Configure baseline university categories available to all student accounts
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>New System Category</span>
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xs overflow-hidden">
        {loading ? (
          <Loader message="Loading categories..." />
        ) : (
          <CategoryTable
            categories={categories}
            onEdit={handleOpenEdit}
            onDelete={(id) => setDeleteId(id)}
          />
        )}
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editId ? 'Edit Default Category' : 'Create Default Category'}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Category Name
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Type
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs outline-none"
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
                className="w-10 h-10 rounded-xl cursor-pointer border border-slate-200 p-0.5"
              />
              <span className="font-mono text-xs">{formData.color}</span>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold border border-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white"
            >
              Save Category
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Default Category"
        message="Are you sure? Removing this will affect all students relying on this category."
        confirmLabel="Delete"
        isDestructive={true}
      />
    </div>
  );
};

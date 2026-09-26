import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { TipTable } from '../../components/admin/TipTable';
import { Modal } from '../../components/common/Modal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { Loader } from '../../components/common/Loader';
import { Plus } from 'lucide-react';

export const AdminTips: React.FC = () => {
  const [tips, setTips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Food',
    potentialSavingImpact: 0,
    isActive: true,
  });
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchTips = async () => {
    try {
      setLoading(true);
      const res = await adminService.getTips();
      if (res.success && res.data) {
        setTips(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTips();
  }, []);

  const handleOpenCreate = () => {
    setEditId(null);
    setFormData({
      title: '',
      description: '',
      category: 'Food',
      potentialSavingImpact: 0,
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (t: any) => {
    setEditId(t._id);
    setFormData({
      title: t.title,
      description: t.description,
      category: t.category,
      potentialSavingImpact: t.potentialSavingImpact || 0,
      isActive: t.isActive,
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editId) {
        await adminService.updateTip(editId, formData);
      } else {
        await adminService.createTip(formData);
      }
      setIsModalOpen(false);
      fetchTips();
    } catch (err: any) {
      alert(err.message || 'Save failed');
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    try {
      await adminService.deleteTip(deleteId);
      setDeleteId(null);
      fetchTips();
    } catch (err: any) {
      alert(err.message || 'Delete failed');
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Curate Student Saving Tips
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Publish university money hacks, textbook exchange recommendations, and transit advice
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>New Saving Tip</span>
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xs overflow-hidden">
        {loading ? (
          <Loader message="Loading tips..." />
        ) : (
          <TipTable tips={tips} onEdit={handleOpenEdit} onDelete={(id) => setDeleteId(id)} />
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editId ? 'Edit Saving Tip' : 'Publish New Saving Tip'}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Tip Title
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs outline-none"
            >
              <option value="Food">Food</option>
              <option value="Academics">Academics</option>
              <option value="Transport">Transport</option>
              <option value="Utilities">Utilities</option>
              <option value="Lifestyle">Lifestyle</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Estimated Monthly Savings Impact ($)
            </label>
            <input
              type="number"
              min="0"
              value={formData.potentialSavingImpact}
              onChange={(e) =>
                setFormData({ ...formData, potentialSavingImpact: Number(e.target.value) })
              }
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Detailed Description
            </label>
            <textarea
              rows={4}
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="tipActive"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="w-4 h-4 rounded text-brand-600"
            />
            <label htmlFor="tipActive" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Active / Visible to Students
            </label>
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
              Save Tip
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Saving Tip"
        message="Are you sure you want to remove this tip?"
        confirmLabel="Delete"
        isDestructive={true}
      />
    </div>
  );
};

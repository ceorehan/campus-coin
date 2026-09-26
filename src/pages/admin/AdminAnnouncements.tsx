import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { AnnouncementTable } from '../../components/admin/AnnouncementTable';
import { Modal } from '../../components/common/Modal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { Loader } from '../../components/common/Loader';
import { Plus, Megaphone } from 'lucide-react';

export const AdminAnnouncements: React.FC = () => {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    startDate: new Date().toISOString().slice(0, 10),
    endDate: new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString().slice(0, 10),
    status: 'active',
  });
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const res = await adminService.getAnnouncements();
      if (res.success && res.data) {
        setAnnouncements(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleOpenCreate = () => {
    setEditId(null);
    setFormData({
      title: '',
      message: '',
      startDate: new Date().toISOString().slice(0, 10),
      endDate: new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString().slice(0, 10),
      status: 'active',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (a: any) => {
    setEditId(a._id);
    setFormData({
      title: a.title,
      message: a.message,
      startDate: new Date(a.startDate).toISOString().slice(0, 10),
      endDate: new Date(a.endDate).toISOString().slice(0, 10),
      status: a.status,
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editId) {
        await adminService.updateAnnouncement(editId, formData);
      } else {
        await adminService.createAnnouncement(formData);
      }
      setIsModalOpen(false);
      fetchAnnouncements();
    } catch (err: any) {
      alert(err.message || 'Save failed');
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    try {
      await adminService.deleteAnnouncement(deleteId);
      setDeleteId(null);
      fetchAnnouncements();
    } catch (err: any) {
      alert(err.message || 'Delete failed');
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Broadcast Announcements
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Publish university financial notices, scholarship deadlines, and emergency aid updates
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>New Announcement</span>
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xs overflow-hidden">
        {loading ? (
          <Loader message="Loading announcements..." />
        ) : (
          <AnnouncementTable
            announcements={announcements}
            onEdit={handleOpenEdit}
            onDelete={(id) => setDeleteId(id)}
          />
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editId ? 'Edit Announcement' : 'Publish Announcement'}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Headline
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Start Date
              </label>
              <input
                type="date"
                required
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white dark:bg-slate-900 text-xs outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                End Date
              </label>
              <input
                type="date"
                required
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white dark:bg-slate-900 text-xs outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Message Body
            </label>
            <textarea
              rows={4}
              required
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white dark:bg-slate-900 text-xs outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white dark:bg-slate-900 text-xs outline-none"
            >
              <option value="active">Active (Visible)</option>
              <option value="archived">Archived (Hidden)</option>
            </select>
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
              Save Announcement
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Announcement"
        message="Are you sure you want to remove this announcement?"
        confirmLabel="Delete"
        isDestructive={true}
      />
    </div>
  );
};

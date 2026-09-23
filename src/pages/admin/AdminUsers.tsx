import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { UserTable } from '../../components/admin/UserTable';
import { Pagination } from '../../components/common/Pagination';
import { Loader } from '../../components/common/Loader';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { Search, UserCheck } from 'lucide-react';

export const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('');
  const [status, setStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  // Status toggle confirmation
  const [targetUser, setTargetUser] = useState<{ id: string; currentStatus: boolean } | null>(null);

  const fetchUsers = async (page = currentPage) => {
    try {
      setLoading(true);
      const res = await adminService.getUsers({
        page,
        limit: 10,
        search: search || undefined,
        role: role || undefined,
        status: status || undefined,
      });

      if (res.success && res.data) {
        setUsers(res.data.users);
        setTotalRecords(res.data.pagination.totalRecords);
        setTotalPages(res.data.pagination.totalPages);
        setCurrentPage(res.data.pagination.currentPage);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(1);
  }, [role, status]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers(1);
    }, 350);
    return () => clearTimeout(timer);
  }, [search]);

  const handleToggleStatus = (userId: string, currentStatus: boolean) => {
    setTargetUser({ id: userId, currentStatus });
  };

  const handleConfirmToggle = async () => {
    if (!targetUser) return;
    try {
      await adminService.toggleUserStatus(targetUser.id, !targetUser.currentStatus);
      setTargetUser(null);
      fetchUsers();
    } catch (err: any) {
      alert(err.message || 'Failed to update user status');
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          Student Account Directory
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          View registered students, filter by academic role or standing, and manage account authorization
        </p>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Search by student name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs text-slate-800 dark:text-slate-200 outline-none"
          />
        </div>

        <div>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-700 dark:text-slate-300 outline-none"
          >
            <option value="">All Roles</option>
            <option value="student">Students Only</option>
            <option value="admin">Administrators</option>
          </select>
        </div>

        <div>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-700 dark:text-slate-300 outline-none"
          >
            <option value="">All Statuses</option>
            <option value="active">Active Only</option>
            <option value="disabled">Disabled Only</option>
          </select>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xs overflow-hidden">
        {loading ? (
          <Loader message="Querying student records..." />
        ) : (
          <>
            <UserTable users={users} onToggleStatus={handleToggleStatus} />
            <div className="border-t border-slate-100 dark:border-slate-800 px-4">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(p) => fetchUsers(p)}
                totalRecords={totalRecords}
              />
            </div>
          </>
        )}
      </div>

      {/* Confirm status change dialog */}
      <ConfirmDialog
        isOpen={!!targetUser}
        onClose={() => setTargetUser(null)}
        onConfirm={handleConfirmToggle}
        title={targetUser?.currentStatus ? 'Disable Student Account' : 'Re-enable Student Account'}
        message={
          targetUser?.currentStatus
            ? 'Disabling this student will prevent them from signing in and recording transactions until re-enabled.'
            : 'Are you sure you want to restore access to this student account?'
        }
        confirmLabel={targetUser?.currentStatus ? 'Disable' : 'Enable'}
        isDestructive={targetUser?.currentStatus}
      />
    </div>
  );
};

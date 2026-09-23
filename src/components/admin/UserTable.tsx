import React from 'react';
import { UserCheck, UserX } from 'lucide-react';
import { formatDate } from '../../utils/formatDate';

interface UserTableProps {
  users: any[];
  onToggleStatus: (userId: string, currentStatus: boolean) => void;
}

export const UserTable: React.FC<UserTableProps> = ({ users, onToggleStatus }) => {
  if (!users || users.length === 0) {
    return <div className="py-8 text-center text-xs text-slate-400">No users found</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs">
        <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase font-semibold">
          <tr>
            <th className="px-4 py-3">Student Name</th>
            <th className="px-4 py-3">Email</th>
            <th className="px-4 py-3">Academic Year</th>
            <th className="px-4 py-3">Role</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Joined Date</th>
            <th className="px-4 py-3 text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {users.map((u) => (
            <tr key={u._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
              <td className="px-4 py-3 font-bold text-slate-800 dark:text-slate-100">{u.name}</td>
              <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{u.email}</td>
              <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                {u.academicYear || 'Freshman'}
              </td>
              <td className="px-4 py-3">
                <span
                  className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                    u.role === 'admin'
                      ? 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300'
                      : 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300'
                  }`}
                >
                  {u.role}
                </span>
              </td>
              <td className="px-4 py-3">
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    u.isActive
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                  }`}
                >
                  {u.isActive ? 'Active' : 'Disabled'}
                </span>
              </td>
              <td className="px-4 py-3 text-slate-400">{formatDate(u.createdAt, 'short')}</td>
              <td className="px-4 py-3 text-right">
                {u.role !== 'admin' && (
                  <button
                    onClick={() => onToggleStatus(u._id, u.isActive)}
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-semibold transition-colors ${
                      u.isActive
                        ? 'border border-rose-200 text-rose-600 hover:bg-rose-50 dark:border-rose-900/50 dark:hover:bg-rose-950/40'
                        : 'border border-emerald-200 text-emerald-600 hover:bg-emerald-50 dark:border-emerald-900/50 dark:hover:bg-emerald-950/40'
                    }`}
                  >
                    {u.isActive ? <UserX className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
                    <span>{u.isActive ? 'Disable' : 'Enable'}</span>
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import { formatDate } from '../../utils/formatDate';

interface AnnouncementTableProps {
  announcements: any[];
  onEdit: (item: any) => void;
  onDelete: (id: string) => void;
}

export const AnnouncementTable: React.FC<AnnouncementTableProps> = ({
  announcements,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs">
        <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase font-semibold">
          <tr>
            <th className="px-4 py-3">Announcement Title</th>
            <th className="px-4 py-3">Start Date</th>
            <th className="px-4 py-3">End Date</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {announcements.map((a) => (
            <tr key={a._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
              <td className="px-4 py-3">
                <span className="font-bold text-slate-800 dark:text-slate-100 block">
                  {a.title}
                </span>
                <span className="text-[11px] text-slate-500 line-clamp-1">{a.message}</span>
              </td>
              <td className="px-4 py-3 text-slate-500">{formatDate(a.startDate, 'short')}</td>
              <td className="px-4 py-3 text-slate-500">{formatDate(a.endDate, 'short')}</td>
              <td className="px-4 py-3">
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    a.status === 'active'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'bg-slate-100 text-slate-600 dark:bg-slate-800'
                  }`}
                >
                  {a.status}
                </span>
              </td>
              <td className="px-4 py-3 text-right space-x-1">
                <button
                  onClick={() => onEdit(a)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-brand-600 transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onDelete(a._id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

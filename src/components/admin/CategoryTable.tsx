import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';

interface CategoryTableProps {
  categories: any[];
  onEdit: (cat: any) => void;
  onDelete: (id: string) => void;
}

export const CategoryTable: React.FC<CategoryTableProps> = ({ categories, onEdit, onDelete }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs">
        <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase font-semibold">
          <tr>
            <th className="px-4 py-3">Category Name</th>
            <th className="px-4 py-3">Type</th>
            <th className="px-4 py-3">Color Preview</th>
            <th className="px-4 py-3">Scope</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {categories.map((c) => (
            <tr key={c._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
              <td className="px-4 py-3 font-bold text-slate-800 dark:text-slate-100">{c.name}</td>
              <td className="px-4 py-3 uppercase font-semibold text-[10px]">
                <span
                  className={
                    c.type === 'income' ? 'text-emerald-600 font-bold' : 'text-rose-600 font-bold'
                  }
                >
                  {c.type}
                </span>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <span
                    className="w-4 h-4 rounded-full border border-slate-300 dark:border-slate-700"
                    style={{ backgroundColor: c.color || '#6366f1' }}
                  />
                  <span className="font-mono text-[11px] text-slate-500">{c.color}</span>
                </div>
              </td>
              <td className="px-4 py-3">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                  Global System Default
                </span>
              </td>
              <td className="px-4 py-3 text-right space-x-1">
                <button
                  onClick={() => onEdit(c)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onDelete(c._id)}
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

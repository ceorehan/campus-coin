import React, { useState, useEffect } from 'react';
import { bookmarkService } from '../../services/bookmarkService';
import { Loader } from '../../components/common/Loader';
import { Bookmark, Trash2, ExternalLink } from 'lucide-react';
import { formatDate } from '../../utils/formatDate';

export const Bookmarks: React.FC = () => {
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBookmarks = async () => {
    try {
      setLoading(true);
      const res = await bookmarkService.getBookmarks();
      if (res.success && res.data) {
        setBookmarks(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await bookmarkService.removeBookmark(id);
      setBookmarks((prev) => prev.filter((b) => b._id !== id));
    } catch (err: any) {
      alert(err.message || 'Failed to remove bookmark');
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          Saved Bookmarks & Notes
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Your saved student saving tips, AI digests, and financial notes
        </p>
      </div>

      {loading ? (
        <Loader message="Loading your bookmarks..." />
      ) : bookmarks.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
          <Bookmark className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            No Bookmarks Saved Yet
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Bookmark helpful tips or AI recommendations by clicking the bookmark icon anywhere in the app.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {bookmarks.map((b) => (
            <div
              key={b._id}
              className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300">
                    {b.itemType}
                  </span>
                  <button
                    onClick={() => handleDelete(b._id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 transition-colors"
                    title="Remove bookmark"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">{b.title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {b.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                <span>Saved on {formatDate(b.createdAt, 'short')}</span>
                {b.tags && b.tags.length > 0 && (
                  <div className="flex gap-1">
                    {b.tags.slice(0, 3).map((tag: string, i: number) => (
                      <span key={i} className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px]">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

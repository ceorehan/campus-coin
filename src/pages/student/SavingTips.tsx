import React, { useState, useEffect } from 'react';
import { savingTipService } from '../../services/savingTipService';
import { bookmarkService } from '../../services/bookmarkService';
import { useTheme } from '../../context/ThemeContext';
import { Loader } from '../../components/common/Loader';
import { Compass, Bookmark, Check, Sparkles, Filter } from 'lucide-react';
import { formatCurrency } from '../../utils/formatCurrency';

export const SavingTips: React.FC = () => {
  const { currency } = useTheme();

  const [tips, setTips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());

  const categories = ['All', 'Food', 'Academics', 'Transport', 'Utilities', 'Lifestyle'];

  const fetchTips = async () => {
    try {
      setLoading(true);
      const res = await savingTipService.getTips(
        selectedCategory === 'All' ? undefined : selectedCategory
      );
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
  }, [selectedCategory]);

  const handleBookmark = async (tip: any) => {
    try {
      if (bookmarkedIds.has(tip._id)) return;

      await bookmarkService.addBookmark({
        itemType: 'savingTip',
        itemId: tip._id,
        title: tip.title,
        description: tip.description,
        tags: [tip.category, 'tip'],
      });

      setBookmarkedIds((prev) => new Set([...prev, tip._id]));
    } catch (err: any) {
      alert(err.message || 'Bookmark failed');
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          Campus Saving Hacks & Tips
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Practical strategies to make your allowance last through finals week
        </p>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setSelectedCategory(c)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              selectedCategory === c
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-50'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {loading ? (
        <Loader message="Gathering campus hacks..." />
      ) : tips.length === 0 ? (
        <div className="py-12 text-center text-xs text-slate-400">
          No tips found for this category.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tips.map((t) => {
            const isBookmarked = bookmarkedIds.has(t._id);
            return (
              <div
                key={t._id}
                className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300">
                      {t.category}
                    </span>
                    <button
                      onClick={() => handleBookmark(t)}
                      disabled={isBookmarked}
                      className={`p-1.5 rounded-lg transition-colors ${
                        isBookmarked
                          ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50'
                          : 'text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-slate-800'
                      }`}
                      title={isBookmarked ? 'Bookmarked' : 'Save to bookmarks'}
                    >
                      {isBookmarked ? <Check className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">
                    {t.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {t.description}
                  </p>
                </div>

                {t.potentialSavingImpact > 0 && (
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-slate-400 text-[10px] uppercase font-semibold">
                      Est. Semester Impact
                    </span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      +{formatCurrency(t.potentialSavingImpact, currency)}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

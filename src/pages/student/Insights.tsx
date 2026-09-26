import React, { useState, useEffect } from 'react';
import { insightService } from '../../services/insightService';
import { bookmarkService } from '../../services/bookmarkService';
import { Loader } from '../../components/common/Loader';
import { Sparkles, Bookmark, Lightbulb, TrendingDown, RefreshCw, Loader2 } from 'lucide-react';
import { formatDate } from '../../utils/formatDate';

export const Insights: React.FC = () => {
  const [insights, setInsights] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [currentYearMonth] = useState(new Date().toISOString().slice(0, 7));

  const fetchInsights = async () => {
    try {
      setLoading(true);
      const res = await insightService.getInsights();
      if (res.success && res.data) {
        setInsights(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  const handleGenerate = async () => {
    try {
      setGenerating(true);
      const res = await insightService.generateInsight(currentYearMonth);
      if (res.success) {
        fetchInsights();
      }
    } catch (err: any) {
      alert(err.message || 'Failed to generate insight');
    } finally {
      setGenerating(false);
    }
  };

  const handleBookmark = async (id: string, item: any) => {
    try {
      await bookmarkService.addBookmark({
        itemType: 'insight',
        itemId: id,
        title: `AI Digest: ${item.month || 'Current Month'}`,
        description: item.summaryText,
        tags: ['ai', 'digest', item.topCategory || 'budget'],
      });
      alert('Insight saved to your bookmarks!');
    } catch (err: any) {
      alert(err.message || 'Failed to bookmark');
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <span>AI Spending Insights</span>
            <Sparkles className="w-5 h-5 text-brand-600 dark:text-brand-400" />
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Gemini-powered financial evaluations specifically calibrated for student life
          </p>
        </div>

        <button
          onClick={handleGenerate}
          disabled={generating}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-md shadow-brand-500/20 disabled:opacity-50 transition-all"
        >
          {generating ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Sparkles className="w-3.5 h-3.5" />
          )}
          <span>Generate Fresh Insight</span>
        </button>
      </div>

      {loading ? (
        <Loader message="Synthesizing intelligence digests..." />
      ) : insights.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
          <Sparkles className="w-10 h-10 text-brand-500 mx-auto" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            No Insights Generated Yet
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Click "Generate Fresh Insight" above to run an AI scan on your recent transactions and budget performance.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {insights.map((item) => (
            <div
              key={item._id}
              className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition-all space-y-4"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400 block mb-1">
                    Month: {item.month} • Evaluated {formatDate(item.createdAt, 'short')}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Executive Student Summary
                  </h3>
                </div>

                <button
                  onClick={() => handleBookmark(item._id, item)}
                  className="p-2 rounded-xl text-slate-400 hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-slate-800 transition-colors"
                  title="Bookmark this insight"
                >
                  <Bookmark className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                {item.summaryText}
              </p>

              {item.tipText && (
                <div className="p-4 rounded-2xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 flex items-start gap-3">
                  <Lightbulb className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-[11px] font-bold text-amber-900 dark:text-amber-200 uppercase tracking-wider">
                      Recommended Action Step
                    </h5>
                    <p className="text-xs text-amber-800 dark:text-amber-300 mt-0.5">
                      {item.tipText}
                    </p>
                  </div>
                </div>
              )}

              {item.topCategory && (
                <div className="pt-2 flex items-center gap-2 text-xs text-slate-500">
                  <span className="text-[11px]">Primary expenditure driver:</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {item.topCategory}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

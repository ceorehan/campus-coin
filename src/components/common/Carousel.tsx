import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CarouselProps {
  children: React.ReactNode[];
  /** Cards visible at once on desktop; scales down automatically on smaller screens. */
  perView?: number;
  autoPlayMs?: number;
  className?: string;
}

/**
 * Lightweight, dependency-free page carousel. Groups children into pages of
 * `perView` (1 on mobile) and slides whole pages, so cards never appear cropped.
 */
export const Carousel: React.FC<CarouselProps> = ({ children, perView = 3, autoPlayMs = 4500, className = '' }) => {
  const [viewportWidth, setViewportWidth] = useState<number>(typeof window !== 'undefined' ? window.innerWidth : 1280);
  const [page, setPage] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const onResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const itemsPerPage = viewportWidth < 640 ? 1 : viewportWidth < 1024 ? 2 : perView;
  const pageCount = Math.max(1, Math.ceil(children.length / itemsPerPage));

  useEffect(() => {
    if (page > pageCount - 1) setPage(0);
  }, [pageCount, page]);

  useEffect(() => {
    if (paused || autoPlayMs <= 0 || pageCount <= 1) return;
    timerRef.current = setInterval(() => {
      setPage((p) => (p + 1) % pageCount);
    }, autoPlayMs);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [paused, autoPlayMs, pageCount]);

  const pages = useMemo(() => {
    const grouped: React.ReactNode[][] = [];
    for (let i = 0; i < children.length; i += itemsPerPage) {
      grouped.push(children.slice(i, i + itemsPerPage));
    }
    return grouped;
  }, [children, itemsPerPage]);

  return (
    <div
      className={`relative ${className}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="cc-carousel-viewport">
        <div className="cc-carousel-track" style={{ transform: `translateX(-${page * 100}%)` }}>
          {pages.map((group, i) => (
            <div key={i} className="w-full shrink-0 grid gap-6" style={{ gridTemplateColumns: `repeat(${group.length}, minmax(0, 1fr))` }}>
              {group}
            </div>
          ))}
        </div>
      </div>

      {pageCount > 1 && (
        <>
          <button
            aria-label="Previous"
            onClick={() => setPage((p) => (p - 1 + pageCount) % pageCount)}
            className="hidden md:flex absolute -left-5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md items-center justify-center text-slate-600 dark:text-slate-300 hover:text-brand-600 hover:border-brand-300 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            aria-label="Next"
            onClick={() => setPage((p) => (p + 1) % pageCount)}
            className="hidden md:flex absolute -right-5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md items-center justify-center text-slate-600 dark:text-slate-300 hover:text-brand-600 hover:border-brand-300 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <div className="flex items-center justify-center gap-2 mt-6">
            {pages.map((_, i) => (
              <button
                key={i}
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => setPage(i)}
                className={`cc-carousel-dot ${i === page ? 'active' : ''}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

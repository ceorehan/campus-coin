import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoaderProps {
  message?: string;
  fullScreen?: boolean;
}

export const Loader: React.FC<LoaderProps> = ({ message = 'Loading Campus Coin...', fullScreen = false }) => {
  const content = (
    <div className="flex flex-col items-center justify-center p-8 space-y-3">
      <Loader2 className="w-8 h-8 text-brand-600 dark:text-brand-400 animate-spin" />
      <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{message}</p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        {content}
      </div>
    );
  }

  return content;
};

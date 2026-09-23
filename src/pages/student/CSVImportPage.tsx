import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CSVImport } from '../../components/transactions/CSVImport';
import { useTheme } from '../../context/ThemeContext';
import { ArrowLeft, Upload } from 'lucide-react';

export const CSVImportPage: React.FC = () => {
  const navigate = useNavigate();
  const { currency } = useTheme();

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div className="flex items-center gap-3">
        <Link
          to="/transactions"
          className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-xl font-black text-slate-900 dark:text-white">
            Import Bank Statement (CSV)
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Upload your transactions statement to bulk populate your student ledger with Gemini AI categorization
          </p>
        </div>
      </div>

      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <CSVImport onSuccess={() => navigate('/transactions')} currency={currency} />
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Upload, Download, CheckCircle, AlertTriangle, FileText, Loader2, ArrowRight } from 'lucide-react';
import api from '../../services/api';
import { formatCurrency } from '../../utils/formatCurrency';

interface CSVImportProps {
  onSuccess: () => void;
  currency?: string;
}

export const CSVImport: React.FC<CSVImportProps> = ({ onSuccess, currency = 'USD' }) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [previewData, setPreviewData] = useState<any>(null);
  const [confirming, setConfirming] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [importSummary, setImportSummary] = useState<string>('');

  const handleDownloadSample = () => {
    const csvContent =
      'Date,Type,Category,Amount,Description\n' +
      '2026-03-01,income,Allowance,50000,Monthly allowance from parents\n' +
      '2026-03-02,expense,Hostel/Rent,15000,Hostel dorm room monthly fee\n' +
      '2026-03-03,expense,Food,350,Campus dining hall breakfast\n' +
      '2026-03-04,expense,Transport,120,Bus ticket to library\n' +
      '2026-03-05,expense,Academics,1200,Calculus notebook and pens\n';

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'campus_coin_sample_transactions.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError('');
      setPreviewData(null);
    }
  };

  const handleUploadAndPreview = async () => {
    if (!file) {
      setError('Please choose a CSV file to upload');
      return;
    }

    try {
      setUploading(true);
      setError('');
      const formData = new FormData();
      formData.append('file', file);

      const res = await api.post('/import/csv', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res.data.success && res.data.data) {
        setPreviewData(res.data.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to parse CSV file');
    } finally {
      setUploading(false);
    }
  };

  const handleConfirmImport = async () => {
    if (!previewData || !previewData.rows) return;

    try {
      setConfirming(true);
      setError('');
      const validRows = previewData.rows.filter((r: any) => r.isValid);

      const res = await api.post('/import/confirm', { rows: validRows });
      if (res.data.success) {
        setImportSummary(`Successfully imported ${res.data.data.importedCount} transactions!`);
        setTimeout(() => {
          onSuccess();
        }, 1500);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Import failed');
    } finally {
      setConfirming(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Instructions & Sample Download */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/40">
        <div>
          <h4 className="text-xs font-bold text-indigo-900 dark:text-indigo-200">
            Import Bank or Mobile Wallet CSV
          </h4>
          <p className="text-[11px] text-indigo-700/80 dark:text-indigo-300/80 mt-0.5">
            Columns expected: <code className="font-mono">Date</code>, <code className="font-mono">Type</code> (income/expense), <code className="font-mono">Category</code>, <code className="font-mono">Amount</code>, <code className="font-mono">Description</code>.
          </p>
        </div>
        <button
          type="button"
          onClick={handleDownloadSample}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 shadow-xs hover:bg-indigo-50/50 transition-colors shrink-0"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Download Sample CSV</span>
        </button>
      </div>

      {/* File Upload Zone */}
      {!previewData && (
        <div className="p-6 rounded-3xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-indigo-600 dark:text-indigo-400">
            <Upload className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
              Select your CSV statement
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Only standard comma-separated .csv files are supported
            </p>
          </div>
          <div className="flex items-center justify-center gap-3">
            <input
              type="file"
              accept=".csv"
              id="csvFileInput"
              onChange={handleFileChange}
              className="hidden"
            />
            <label
              htmlFor="csvFileInput"
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 cursor-pointer transition-colors"
            >
              {file ? file.name : 'Choose File'}
            </label>
            {file && (
              <button
                type="button"
                onClick={handleUploadAndPreview}
                disabled={uploading}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-colors"
              >
                {uploading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Validate & Preview</span>
              </button>
            )}
          </div>
        </div>
      )}

      {error && (
        <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 text-rose-700 dark:text-rose-300 text-xs">
          {error}
        </div>
      )}

      {importSummary && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          <span>{importSummary}</span>
        </div>
      )}

      {/* Preview Table */}
      {previewData && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Preview ({previewData.totalRows} rows parsed)
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                {previewData.validCount} Valid
              </span>
              {previewData.invalidCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300">
                  {previewData.invalidCount} Invalid
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setPreviewData(null);
                  setFile(null);
                }}
                className="px-3 py-1.5 rounded-xl text-xs font-medium border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 transition-colors"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={handleConfirmImport}
                disabled={confirming || previewData.validCount === 0}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs disabled:opacity-50 transition-colors"
              >
                {confirming && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Confirm & Import ({previewData.validCount})</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto max-h-80 border border-slate-200 dark:border-slate-800 rounded-2xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase font-semibold sticky top-0">
                <tr>
                  <th className="px-3 py-2.5">Row</th>
                  <th className="px-3 py-2.5">Date</th>
                  <th className="px-3 py-2.5">Type</th>
                  <th className="px-3 py-2.5">Category</th>
                  <th className="px-3 py-2.5">Amount</th>
                  <th className="px-3 py-2.5">Description</th>
                  <th className="px-3 py-2.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {previewData.rows.map((row: any) => (
                  <tr
                    key={row.rowIndex}
                    className={
                      row.isValid
                        ? 'hover:bg-slate-50/50 dark:hover:bg-slate-800/30'
                        : 'bg-rose-50/30 dark:bg-rose-950/20'
                    }
                  >
                    <td className="px-3 py-2 text-slate-400">{row.rowIndex}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-slate-700 dark:text-slate-300">
                      {row.date}
                    </td>
                    <td className="px-3 py-2 uppercase font-bold text-[10px]">
                      {row.type}
                    </td>
                    <td className="px-3 py-2">
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {row.matchedCategoryName}
                      </span>
                      {row.aiSuggested && (
                        <span className="ml-1 text-[10px] text-indigo-600 dark:text-indigo-400">
                          (AI: {row.aiSuggested})
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-2 font-bold text-slate-900 dark:text-slate-100">
                      {formatCurrency(row.amount, currency)}
                    </td>
                    <td className="px-3 py-2 truncate max-w-xs text-slate-600 dark:text-slate-400">
                      {row.description}
                    </td>
                    <td className="px-3 py-2">
                      {row.isValid ? (
                        <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold text-[10px]">
                          <CheckCircle className="w-3 h-3" />
                          <span>Ready</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-rose-600 dark:text-rose-400 font-semibold text-[10px]" title={row.error}>
                          <AlertTriangle className="w-3 h-3" />
                          <span>{row.error || 'Invalid'}</span>
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

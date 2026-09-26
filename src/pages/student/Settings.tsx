import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { userService } from '../../services/userService';
import { Sun, Moon, Type, DollarSign, Lock, CheckCircle2, Loader2 } from 'lucide-react';

export const Settings: React.FC = () => {
  const { theme, toggleTheme, fontSize, setFontSize, currency, setCurrency } = useTheme();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwdLoading, setPwdLoading] = useState(false);
  const [pwdSuccess, setPwdSuccess] = useState(false);
  const [pwdError, setPwdError] = useState('');

  const currencies = [
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'PKR', symbol: 'Rs', name: 'Pakistani Rupee' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'GBP', symbol: '£', name: 'British Pound' },
    { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
    { code: 'CAD', symbol: 'CA$', name: 'Canadian Dollar' },
    { code: 'AUD', symbol: 'AU$', name: 'Australian Dollar' },
  ];

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPwdError('New passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      setPwdError('Password must be at least 6 characters');
      return;
    }

    try {
      setPwdLoading(true);
      setPwdError('');
      setPwdSuccess(false);

      await userService.changePassword({ currentPassword, newPassword });
      setPwdSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setPwdError(err.response?.data?.message || err.message || 'Password update failed');
    } finally {
      setPwdLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          Application Preferences & Settings
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Customize your appearance, currency display, accessibility font size, and account security
        </p>
      </div>

      {/* Appearance & Currency Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
          Display & Localization
        </h3>

        {/* Theme mode toggle */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
              Color Theme
            </span>
            <span className="text-[11px] text-slate-500">
              Toggle between bright campus mode and comfortable late-night dark mode
            </span>
          </div>
          <button
            onClick={toggleTheme}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 transition-colors"
          >
            {theme === 'dark' ? <Moon className="w-4 h-4 text-brand-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
            <span className="capitalize">{theme} Mode</span>
          </button>
        </div>

        {/* Font size accessibility */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
              Font Scale
            </span>
            <span className="text-[11px] text-slate-500">
              Increase typography size for easier reading on laptops and mobile devices
            </span>
          </div>
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800">
            <button
              onClick={() => setFontSize('normal')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                fontSize === 'normal'
                  ? 'bg-white dark:bg-slate-900 text-brand-600 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Normal
            </button>
            <button
              onClick={() => setFontSize('large')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                fontSize === 'large'
                  ? 'bg-white dark:bg-slate-900 text-brand-600 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Large
            </button>
          </div>
        </div>

        {/* Currency selector */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
              Currency Format
            </span>
            <span className="text-[11px] text-slate-500">
              Format allowances and transactions in your university's native currency
            </span>
          </div>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs font-semibold text-slate-800 dark:text-slate-200 outline-none"
          >
            {currencies.map((c) => (
              <option key={c.code} value={c.code}>
                {c.symbol} - {c.name} ({c.code})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Security & Password Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Lock className="w-4 h-4 text-brand-500" />
          <span>Change Password</span>
        </h3>

        {pwdSuccess && (
          <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Password updated successfully!</span>
          </div>
        )}

        {pwdError && (
          <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 text-rose-700 text-xs">
            {pwdError}
          </div>
        )}

        <form onSubmit={handlePasswordChange} className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Current Password
            </label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                New Password
              </label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={pwdLoading}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-xs disabled:opacity-50 transition-colors"
            >
              {pwdLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>Update Password</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

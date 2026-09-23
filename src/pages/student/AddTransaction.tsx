import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { transactionService } from '../../services/transactionService';
import { TransactionForm } from '../../components/transactions/TransactionForm';
import { ArrowLeft, PlusCircle } from 'lucide-react';

export const AddTransaction: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData: any) => {
    try {
      setLoading(true);
      await transactionService.createTransaction(formData);
      navigate('/transactions');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-12">
      <div className="flex items-center gap-3">
        <Link
          to="/transactions"
          className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-xl font-black text-slate-900 dark:text-white">
            Add New Transaction
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Log an allowance deposit, hostel payment, or daily campus expense
          </p>
        </div>
      </div>

      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <TransactionForm
          onSubmit={handleSubmit}
          onCancel={() => navigate('/transactions')}
          loading={loading}
        />
      </div>
    </div>
  );
};

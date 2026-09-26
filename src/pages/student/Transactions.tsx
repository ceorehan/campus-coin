import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { transactionService } from '../../services/transactionService';
import { categoryService } from '../../services/categoryService';
import { useTheme } from '../../context/ThemeContext';
import { TransactionTable } from '../../components/transactions/TransactionTable';
import { TransactionFilter } from '../../components/transactions/TransactionFilter';
import { TransactionForm } from '../../components/transactions/TransactionForm';
import { Modal } from '../../components/common/Modal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { Pagination } from '../../components/common/Pagination';
import { Loader } from '../../components/common/Loader';
import { PlusCircle, Upload, Download, Receipt } from 'lucide-react';
import { formatCurrency } from '../../utils/formatCurrency';

export const Transactions: React.FC = () => {
  const { currency } = useTheme();

  const [transactions, setTransactions] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  // Filters
  const [search, setSearch] = useState('');
  const [type, setType] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sortBy, setSortBy] = useState('date');

  // Modals
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedTx, setSelectedTx] = useState<any>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchCategories = async () => {
    try {
      const res = await categoryService.getCategories();
      if (res.success && res.data) {
        setCategories(res.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchTransactions = async (page = currentPage) => {
    try {
      setLoading(true);
      const res = await transactionService.getTransactions({
        page,
        limit: 10,
        type: type || undefined,
        categoryId: categoryId || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        search: search || undefined,
        sortBy,
      });

      if (res.success && res.data) {
        setTransactions(res.data.transactions);
        setTotalRecords(res.data.pagination.totalRecords);
        setTotalPages(res.data.pagination.totalPages);
        setCurrentPage(res.data.pagination.currentPage);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchTransactions(1);
  }, [type, categoryId, startDate, endDate, sortBy]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchTransactions(1);
    }, 350);
    return () => clearTimeout(timer);
  }, [search]);

  const handleResetFilters = () => {
    setSearch('');
    setType('');
    setCategoryId('');
    setStartDate('');
    setEndDate('');
    setSortBy('date');
  };

  const handleEditClick = (t: any) => {
    setSelectedTx(t);
    setIsEditOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    try {
      await transactionService.deleteTransaction(deleteId);
      setIsDeleteOpen(false);
      setDeleteId(null);
      fetchTransactions();
    } catch (err: any) {
      alert(err.message || 'Failed to delete transaction');
    }
  };

  const handleUpdateTransaction = async (formData: any) => {
    if (!selectedTx) return;
    await transactionService.updateTransaction(selectedTx._id, formData);
    setIsEditOpen(false);
    setSelectedTx(null);
    fetchTransactions();
  };

  const handleExportCSV = () => {
    if (!transactions.length) return;
    let csv = 'Date,Type,Category,Amount,Description\n';
    transactions.forEach((t) => {
      const cat = t.categoryId?.name || 'General';
      const desc = `"${(t.description || '').replace(/"/g, '""')}"`;
      csv += `${new Date(t.date).toISOString().slice(0, 10)},${t.type},${cat},${t.amount},${desc}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `campus_coin_transactions_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header & Action Row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Transaction Ledger
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            View, search, categorize, and export your daily student expenses and allowances
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            disabled={transactions.length === 0}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 transition-colors shadow-xs disabled:opacity-50"
            title="Download visible records as CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
          <Link
            to="/import"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 transition-colors shadow-xs"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Import</span>
          </Link>
          <Link
            to="/transactions/new"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-md shadow-brand-500/20 transition-all"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>+ Add Transaction</span>
          </Link>
        </div>
      </div>

      {/* Filter Component */}
      <TransactionFilter
        search={search}
        onSearchChange={setSearch}
        type={type}
        onTypeChange={setType}
        categoryId={categoryId}
        onCategoryChange={setCategoryId}
        categories={categories}
        startDate={startDate}
        onStartDateChange={setStartDate}
        endDate={endDate}
        onEndDateChange={setEndDate}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        onReset={handleResetFilters}
      />

      {/* Main Table Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xs overflow-hidden">
        {loading ? (
          <Loader message="Loading transactions..." />
        ) : (
          <>
            <TransactionTable
              transactions={transactions}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
              currency={currency}
            />
            <div className="border-t border-slate-100 dark:border-slate-800 px-4">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(p) => fetchTransactions(p)}
                totalRecords={totalRecords}
              />
            </div>
          </>
        )}
      </div>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditOpen}
        onClose={() => {
          setIsEditOpen(false);
          setSelectedTx(null);
        }}
        title="Edit Transaction"
      >
        {selectedTx && (
          <TransactionForm
            initialData={selectedTx}
            onSubmit={handleUpdateTransaction}
            onCancel={() => {
              setIsEditOpen(false);
              setSelectedTx(null);
            }}
          />
        )}
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setDeleteId(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Transaction"
        message="Are you sure you want to permanently delete this transaction? This will automatically update your monthly budget calculation."
        confirmLabel="Delete"
        isDestructive={true}
      />
    </div>
  );
};

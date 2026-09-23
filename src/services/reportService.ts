import api from './api';

export const reportService = {
  getMonthlyReport: async (month?: string) => {
    const res = await api.get('/reports/monthly', { params: month ? { month } : {} });
    return res.data;
  },
  getMonthlySummary: async (month?: string) => {
    const res = await api.get('/reports/monthly', { params: month ? { month } : {} });
    return res.data;
  },

  getCategoryReport: async (month?: string, type: 'expense' | 'income' = 'expense') => {
    const res = await api.get('/reports/category', { params: { month, type } });
    return res.data;
  },
  getCategoryBreakdown: async (month?: string, type: 'expense' | 'income' = 'expense') => {
    const res = await api.get('/reports/category', { params: { month, type } });
    return res.data;
  },

  getSixMonthReport: async () => {
    const res = await api.get('/reports/six-month');
    return res.data;
  },
  getTrend: async (_months?: number) => {
    const res = await api.get('/reports/six-month');
    return res.data;
  },

  getDailyReport: async (month?: string) => {
    const res = await api.get('/reports/daily', { params: month ? { month } : {} });
    return res.data;
  },
  getDailySpending: async (month?: string) => {
    const res = await api.get('/reports/daily', { params: month ? { month } : {} });
    return res.data;
  },

  getWeeklyReport: async (month?: string) => {
    const res = await api.get('/reports/weekly', { params: month ? { month } : {} });
    return res.data;
  },

  exportReport: async (params: Record<string, any> = {}) => {
    const res = await api.get('/reports/export', { params });
    return res.data;
  },
  exportCSVReport: async (month?: string) => {
    const res = await api.get('/reports/export', { params: { month, format: 'csv' }, responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `financial-report-${month || 'all'}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    return res.data;
  },
};

import api from './api';

export const budgetService = {
  getBudgets: async (month?: string) => {
    const res = await api.get('/budgets', { params: month ? { month } : {} });
    return res.data;
  },

  createBudget: async (data: { categoryId: string; limitAmount: number; month?: string }) => {
    const res = await api.post('/budgets', data);
    return res.data;
  },

  setBudget: async (data: { categoryId: string; limitAmount: number; month?: string }) => {
    const res = await api.post('/budgets', data);
    return res.data;
  },

  updateBudget: async (id: string, data: { limitAmount: number }) => {
    const res = await api.put(`/budgets/${id}`, data);
    return res.data;
  },

  deleteBudget: async (id: string) => {
    const res = await api.delete(`/budgets/${id}`);
    return res.data;
  },
};

import api from './api';

export const categoryService = {
  getCategories: async (type?: 'income' | 'expense') => {
    const res = await api.get('/categories', { params: type ? { type } : {} });
    return res.data;
  },

  createCategory: async (data: { name: string; type: 'income' | 'expense'; color?: string; icon?: string }) => {
    const res = await api.post('/categories', data);
    return res.data;
  },

  updateCategory: async (id: string, data: any) => {
    const res = await api.put(`/categories/${id}`, data);
    return res.data;
  },

  deleteCategory: async (id: string) => {
    const res = await api.delete(`/categories/${id}`);
    return res.data;
  },

  suggestCategory: async (description: string, type: 'income' | 'expense' = 'expense') => {
    const res = await api.post('/categories/suggest', { description, type });
    return res.data;
  },
};

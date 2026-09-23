import api from './api';

export const savingTipService = {
  getSavingTips: async (category?: string) => {
    const res = await api.get('/saving-tips', { params: category ? { category } : {} });
    return res.data;
  },
  getTips: async (category?: string) => {
    const res = await api.get('/saving-tips', { params: category ? { category } : {} });
    return res.data;
  },

  bookmarkTip: async (id: string, data?: any) => {
    const res = await api.post(`/saving-tips/${id}/bookmark`, data || {});
    return res.data;
  },

  dismissTip: async (id: string) => {
    const res = await api.post(`/saving-tips/${id}/dismiss`);
    return res.data;
  },

  getBookmarks: async (type?: 'tip' | 'insight' | 'report') => {
    const res = await api.get('/bookmarks', { params: type ? { type } : {} });
    return res.data;
  },

  removeBookmark: async (id: string) => {
    const res = await api.delete(`/bookmarks/${id}`);
    return res.data;
  },
};

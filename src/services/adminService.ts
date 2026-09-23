import api from './api';

export const adminService = {
  getUsers: async (params: Record<string, any> = {}) => {
    const res = await api.get('/admin/users', { params });
    return res.data;
  },

  updateUserStatus: async (id: string, isActive?: boolean) => {
    const res = await api.put(`/admin/users/${id}/status`, { isActive });
    return res.data;
  },

  getCategories: async () => {
    const res = await api.get('/admin/categories');
    return res.data;
  },
  getDefaultCategories: async () => {
    const res = await api.get('/admin/categories');
    return res.data;
  },

  createCategory: async (data: any) => {
    const res = await api.post('/admin/categories', data);
    return res.data;
  },
  createDefaultCategory: async (data: any) => {
    const res = await api.post('/admin/categories', data);
    return res.data;
  },

  updateCategory: async (id: string, data: any) => {
    const res = await api.put(`/admin/categories/${id}`, data);
    return res.data;
  },
  updateDefaultCategory: async (id: string, data: any) => {
    const res = await api.put(`/admin/categories/${id}`, data);
    return res.data;
  },

  deleteCategory: async (id: string) => {
    const res = await api.delete(`/admin/categories/${id}`);
    return res.data;
  },
  deleteDefaultCategory: async (id: string) => {
    const res = await api.delete(`/admin/categories/${id}`);
    return res.data;
  },

  toggleUserStatus: async (id: string, isActive?: boolean) => {
    const res = await api.put(`/admin/users/${id}/status`, { isActive });
    return res.data;
  },

  getTips: async () => {
    const res = await api.get('/admin/tips');
    return res.data;
  },

  createTip: async (data: any) => {
    const res = await api.post('/admin/tips', data);
    return res.data;
  },

  updateTip: async (id: string, data: any) => {
    const res = await api.put(`/admin/tips/${id}`, data);
    return res.data;
  },

  deleteTip: async (id: string) => {
    const res = await api.delete(`/admin/tips/${id}`);
    return res.data;
  },

  getAnnouncements: async () => {
    const res = await api.get('/admin/announcements');
    return res.data;
  },

  createAnnouncement: async (data: any) => {
    const res = await api.post('/admin/announcements', data);
    return res.data;
  },

  updateAnnouncement: async (id: string, data: any) => {
    const res = await api.put(`/admin/announcements/${id}`, data);
    return res.data;
  },

  deleteAnnouncement: async (id: string) => {
    const res = await api.delete(`/admin/announcements/${id}`);
    return res.data;
  },

  getStatistics: async () => {
    const res = await api.get('/admin/statistics');
    return res.data;
  },
};

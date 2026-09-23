import api from './api';

export const authService = {
  login: async (credentials: { email: string; password: string }) => {
    const res = await api.post('/auth/login', credentials);
    return res.data;
  },

  register: async (userData: any) => {
    const res = await api.post('/auth/register', userData);
    return res.data;
  },

  forgotPassword: async (email: string) => {
    const res = await api.post('/auth/forgot-password', { email });
    return res.data;
  },

  resetPassword: async (data: { email: string; token: string; newPassword: string }) => {
    const res = await api.post('/auth/reset-password', data);
    return res.data;
  },

  getMe: async () => {
    const res = await api.get('/auth/me');
    return res.data;
  },

  getProfile: async () => {
    const res = await api.get('/users/profile');
    return res.data;
  },

  updateProfile: async (data: any) => {
    const res = await api.put('/users/profile', data);
    return res.data;
  },
};

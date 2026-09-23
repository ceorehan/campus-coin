import api from './api';

export const insightService = {
  getInsights: async () => {
    const res = await api.get('/insights');
    return res.data;
  },

  generateInsight: async (month?: string) => {
    const res = await api.post('/insights/generate', { month });
    return res.data;
  },
};

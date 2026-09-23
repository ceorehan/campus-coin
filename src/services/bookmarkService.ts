import api from './api';

export interface BookmarkPayload {
  itemType: 'savingTip' | 'insight' | 'announcement';
  itemId?: string;
  title: string;
  description?: string;
  tags?: string[];
}

export const bookmarkService = {
  getBookmarks: async () => {
    const res = await api.get('/bookmarks');
    return res.data;
  },

  addBookmark: async (data: BookmarkPayload) => {
    const res = await api.post('/bookmarks', data);
    return res.data;
  },

  removeBookmark: async (id: string) => {
    const res = await api.delete(`/bookmarks/${id}`);
    return res.data;
  },
};

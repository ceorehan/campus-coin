import api from './api';

export interface UpdateProfilePayload {
  name?: string;
  academicYear?: string;
  monthlyAllowanceBaseline?: number;
  savingsGoal?: number;
  currency?: string;
  themePreference?: string;
  fontSize?: string;
  notificationsEnabled?: boolean;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export const userService = {
  getProfile: async () => {
    const res = await api.get('/users/profile');
    return res.data;
  },

  updateProfile: async (data: UpdateProfilePayload) => {
    const res = await api.put('/users/profile', data);
    return res.data;
  },

  changePassword: async (data: ChangePasswordPayload) => {
    const res = await api.put('/users/change-password', data);
    return res.data;
  },
};

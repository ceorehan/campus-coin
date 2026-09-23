import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'admin';
  academicYear?: string;
  monthlyAllowanceBaseline?: number;
  savingsGoal?: number;
  currency?: string;
  themePreference?: 'light' | 'dark' | 'system';
  fontSize?: 'normal' | 'large';
  notificationsEnabled?: boolean;
}

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  loading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<UserProfile>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
  updateUser: (updatedData: Partial<UserProfile>) => void;
  refreshUser: () => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('campus_coin_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('campus_coin_token');
  });
  const [loading, setLoading] = useState<boolean>(true);

  const refreshUser = async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const res = await authService.getMe();
      if (res.success && res.data) {
        setUser(res.data);
        localStorage.setItem('campus_coin_user', JSON.stringify(res.data));
      }
    } catch (err) {
      console.warn('Failed to verify token, clearing session');
      logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (credentials: { email: string; password: string }): Promise<UserProfile> => {
    const res = await authService.login(credentials);
    if (res.success && res.data) {
      const { token: newToken, user: newUser } = res.data;
      setToken(newToken);
      setUser(newUser);
      localStorage.setItem('campus_coin_token', newToken);
      localStorage.setItem('campus_coin_user', JSON.stringify(newUser));
      return newUser;
    } else {
      throw new Error(res.message || 'Login failed');
    }
  };

  const register = async (userData: any) => {
    const res = await authService.register(userData);
    if (res.success && res.data) {
      const { token: newToken, user: newUser } = res.data;
      setToken(newToken);
      setUser(newUser);
      localStorage.setItem('campus_coin_token', newToken);
      localStorage.setItem('campus_coin_user', JSON.stringify(newUser));
    } else {
      throw new Error(res.message || 'Registration failed');
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('campus_coin_token');
    localStorage.removeItem('campus_coin_user');
  };

  const updateUser = (updatedData: Partial<UserProfile>) => {
    if (!user) return;
    const updated = { ...user, ...updatedData };
    setUser(updated);
    localStorage.setItem('campus_coin_user', JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        updateUser,
        refreshUser,
        isAuthenticated: !!token && !!user,
        isAdmin: user?.role === 'admin',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

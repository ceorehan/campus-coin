import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { NotificationProvider } from './context/NotificationContext';

// Layouts
import { PublicLayout } from './layouts/PublicLayout';
import { StudentLayout } from './layouts/StudentLayout';
import { AdminLayout } from './layouts/AdminLayout';

// Public Pages
import { Home } from './pages/public/Home';
import { Features } from './pages/public/Features';
import { HowItWorks } from './pages/public/HowItWorks';
import { About } from './pages/public/About';
import { Contact } from './pages/public/Contact';
import { Sitemap } from './pages/public/Sitemap';

// Auth Pages
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';
import { ForgotPassword } from './pages/auth/ForgotPassword';
import { ResetPassword } from './pages/auth/ResetPassword';
import { AdminLogin } from './pages/admin/AdminLogin';

// Student Portal Pages
import { Dashboard } from './pages/student/Dashboard';
import { Transactions } from './pages/student/Transactions';
import { AddTransaction } from './pages/student/AddTransaction';
import { CSVImportPage } from './pages/student/CSVImportPage';
import { Categories } from './pages/student/Categories';
import { Budgets } from './pages/student/Budgets';
import { Reports } from './pages/student/Reports';
import { Insights } from './pages/student/Insights';
import { SavingTips } from './pages/student/SavingTips';
import { Bookmarks } from './pages/student/Bookmarks';
import { NotificationsPage } from './pages/student/Notifications';
import { Profile } from './pages/student/Profile';
import { Settings } from './pages/student/Settings';

// Admin Portal Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminUsers } from './pages/admin/AdminUsers';
import { AdminCategories } from './pages/admin/AdminCategories';
import { AdminTips } from './pages/admin/AdminTips';
import { AdminAnnouncements } from './pages/admin/AdminAnnouncements';
import { AdminStatistics } from './pages/admin/AdminStatistics';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NotificationProvider>
          <BrowserRouter>
            <Routes>
              {/* Public Routes with standard Header/Footer */}
              <Route element={<PublicLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/features" element={<Features />} />
                <Route path="/how-it-works" element={<HowItWorks />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/sitemap" element={<Sitemap />} />

                {/* Authentication Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/admin/login" element={<AdminLogin />} />
              </Route>

              {/* Student Portal (JWT Authenticated) */}
              <Route element={<StudentLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/transactions" element={<Transactions />} />
                <Route path="/transactions/new" element={<AddTransaction />} />
                <Route path="/import" element={<CSVImportPage />} />
                <Route path="/categories" element={<Categories />} />
                <Route path="/budgets" element={<Budgets />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/insights" element={<Insights />} />
                <Route path="/saving-tips" element={<SavingTips />} />
                <Route path="/bookmarks" element={<Bookmarks />} />
                <Route path="/notifications" element={<NotificationsPage />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/settings" element={<Settings />} />
              </Route>

              {/* Administration Portal (Admin Role Required) */}
              <Route element={<AdminLayout />}>
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/users" element={<AdminUsers />} />
                <Route path="/admin/categories" element={<AdminCategories />} />
                <Route path="/admin/tips" element={<AdminTips />} />
                <Route path="/admin/announcements" element={<AdminAnnouncements />} />
                <Route path="/admin/statistics" element={<AdminStatistics />} />
              </Route>

              {/* Catch-all redirect */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

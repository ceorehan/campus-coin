import express from 'express';
import {
  getUsers,
  updateUserStatus,
  getAdminCategories,
  createAdminCategory,
  updateAdminCategory,
  deleteAdminCategory,
  getAdminTips,
  createAdminTip,
  updateAdminTip,
  deleteAdminTip,
  getAdminAnnouncements,
  createAdminAnnouncement,
  updateAdminAnnouncement,
  deleteAdminAnnouncement,
  getAdminStatistics,
} from '../controllers/adminController.js';
import { protect } from '../middleware/authMiddleware.js';
import { adminOnly } from '../middleware/adminMiddleware.js';

const router = express.Router();

router.use(protect, adminOnly);

// User Management
router.get('/users', getUsers);
router.put('/users/:id/status', updateUserStatus);

// Category Management
router.get('/categories', getAdminCategories);
router.post('/categories', createAdminCategory);
router.put('/categories/:id', updateAdminCategory);
router.delete('/categories/:id', deleteAdminCategory);

// Saving Tips
router.get('/tips', getAdminTips);
router.post('/tips', createAdminTip);
router.put('/tips/:id', updateAdminTip);
router.delete('/tips/:id', deleteAdminTip);

// Announcements
router.get('/announcements', getAdminAnnouncements);
router.post('/announcements', createAdminAnnouncement);
router.put('/announcements/:id', updateAdminAnnouncement);
router.delete('/announcements/:id', deleteAdminAnnouncement);

// Statistics
router.get('/statistics', getAdminStatistics);

export default router;

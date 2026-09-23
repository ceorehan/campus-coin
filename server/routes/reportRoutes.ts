import express from 'express';
import {
  getMonthlyReport,
  getCategoryReport,
  getSixMonthReport,
  getDailyReport,
  getWeeklyReport,
  exportReport,
} from '../controllers/reportController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/monthly', getMonthlyReport);
router.get('/category', getCategoryReport);
router.get('/six-month', getSixMonthReport);
router.get('/daily', getDailyReport);
router.get('/weekly', getWeeklyReport);
router.get('/export', exportReport);

export default router;

import express from 'express';
import {
  getSavingTips,
  bookmarkItem,
  dismissTip,
  getBookmarks,
  deleteBookmark,
} from '../controllers/savingTipController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/', getSavingTips);
router.post('/:id/bookmark', bookmarkItem);
router.post('/:id/dismiss', dismissTip);

export default router;

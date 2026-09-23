import express from 'express';
import { getBookmarks, bookmarkItem, deleteBookmark } from '../controllers/savingTipController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/', getBookmarks);
router.post('/', bookmarkItem);
router.delete('/:id', deleteBookmark);

export default router;

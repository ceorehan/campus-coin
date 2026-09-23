import express from 'express';
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  suggestAICategory,
} from '../controllers/categoryController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/', getCategories);
router.post('/', createCategory);
router.post('/suggest', suggestAICategory);
router.put('/:id', updateCategory);
router.delete('/:id', deleteCategory);

export default router;

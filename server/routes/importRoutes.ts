import express from 'express';
import { uploadAndPreviewCSV, confirmCSVImport } from '../controllers/importController.js';
import { protect } from '../middleware/authMiddleware.js';
import { uploadCSV } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.use(protect);

router.post('/csv', uploadCSV.single('file'), uploadAndPreviewCSV);
router.post('/confirm', confirmCSVImport);

export default router;

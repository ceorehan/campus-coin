import multer from 'multer';

// Use memory storage so we can parse buffer directly without temp disk artifacts
const storage = multer.memoryStorage();

export const uploadCSV = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv') || file.mimetype === 'application/vnd.ms-excel') {
      cb(null, true);
    } else {
      cb(new Error('Only .csv files are supported'));
    }
  },
});

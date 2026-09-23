import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

import { connectDB } from './server/config/db.js';
import { ENV } from './server/config/env.js';

import authRoutes from './server/routes/authRoutes.js';
import userRoutes from './server/routes/userRoutes.js';
import transactionRoutes from './server/routes/transactionRoutes.js';
import categoryRoutes from './server/routes/categoryRoutes.js';
import budgetRoutes from './server/routes/budgetRoutes.js';
import reportRoutes from './server/routes/reportRoutes.js';
import insightRoutes from './server/routes/insightRoutes.js';
import savingTipRoutes from './server/routes/savingTipRoutes.js';
import bookmarkRoutes from './server/routes/bookmarkRoutes.js';
import notificationRoutes from './server/routes/notificationRoutes.js';
import importRoutes from './server/routes/importRoutes.js';
import adminRoutes from './server/routes/adminRoutes.js';

import { notFound, errorHandler } from './server/middleware/errorMiddleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT || 3000);
  const isProduction = process.env.NODE_ENV === 'production';

  // Connect Database & Seed initial data
  await connectDB();

  // Middleware
  app.use(cors());
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // API Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/transactions', transactionRoutes);
  app.use('/api/categories', categoryRoutes);
  app.use('/api/budgets', budgetRoutes);
  app.use('/api/reports', reportRoutes);
  app.use('/api/insights', insightRoutes);
  app.use('/api/saving-tips', savingTipRoutes);
  app.use('/api/bookmarks', bookmarkRoutes);
  app.use('/api/notifications', notificationRoutes);
  app.use('/api/import', importRoutes);
  app.use('/api/admin', adminRoutes);

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'Campus Coin API',
      timestamp: new Date().toISOString(),
    });
  });

  // Vite middleware in dev or static files in production
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (req, res) => {
        res.sendFile(path.resolve(distPath, 'index.html'));
      });
    }
  }

  // Custom error handler for unhandled API errors
  app.use(errorHandler);

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Campus Coin server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal Server Error:', err);
  process.exit(1);
});

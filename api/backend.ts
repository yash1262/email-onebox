import { VercelRequest, VercelResponse } from '@vercel/node';
import type { Express } from 'express';

let app: Express | null = null;

async function getApp(): Promise<Express> {
  if (app) return app;
  
  // Load the Express app synchronously
  const express = await import('express').then(m => m.default);
  const cors = await import('cors').then(m => m.default);
  const helmet = await import('helmet').then(m => m.default);
  
  app = express();

  // Security middleware
  app.use(helmet());

  // CORS
  app.use(cors({
    origin: [
      'http://localhost:5173',
      'http://localhost:5174',
      'https://email-onebox-main.vercel.app',
      'https://email-onebox-frontend.vercel.app',
      process.env.FRONTEND_URL || 'http://localhost:5173'
    ],
    credentials: true
  }));

  // Body parser
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Health check
  app.get('/health', (_req, res) => {
    res.json({
      success: true,
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    });
  });

  // API routes - import the routes
  const { default: routes } = await import('../backend/src/routes/index.js');
  app.use('/api', routes);

  // 404 handler
  app.use((req, res) => {
    res.status(404).json({
      success: false,
      error: 'Not Found',
      path: req.path,
      method: req.method
    });
  });

  return app;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const application = await getApp();
    return application(req, res);
  } catch (error) {
    console.error('Backend error:', error);
    res.status(500).json({
      success: false,
      error: 'Backend service error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}




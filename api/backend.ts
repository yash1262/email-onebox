import { VercelRequest, VercelResponse } from '@vercel/node';
import express from 'express';
import cors from 'cors';

export default function handler(req: VercelRequest, res: VercelResponse) {
  // Create Express app for this request
  const app = express();

  // Middleware
  app.use(cors({
    origin: [
      'http://localhost:5173',
      'http://localhost:5174',
      'https://email-onebox-main.vercel.app',
      process.env.FRONTEND_URL || '*'
    ],
    credentials: true
  }));

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Health endpoint
  app.get('/health', (_req, healthRes) => {
    healthRes.json({
      success: true,
      status: 'healthy',
      timestamp: new Date().toISOString()
    });
  });

  // API routes - import dynamically
  app.get('/emails', async (_req, emailRes) => {
    try {
      emailRes.json({
        success: true,
        message: 'Emails endpoint - backend connected',
        data: []
      });
    } catch (error) {
      emailRes.status(500).json({ success: false, error: 'Failed' });
    }
  });

  // Fallback
  app.all('*', (_req, fallbackRes) => {
    fallbackRes.status(404).json({
      success: false,
      error: 'Endpoint not found',
      available: ['/health', '/emails']
    });
  });

  // Handle the request
  return app(req, res);
}





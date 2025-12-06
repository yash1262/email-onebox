import { VercelRequest, VercelResponse } from '@vercel/node';
import httpProxy from 'http-proxy';
import dotenv from 'dotenv';

dotenv.config();

// Create a proxy to forward requests to the backend
const proxy = httpProxy.createProxyServer({ changeOrigin: true });

// Determine backend URL based on environment
const getBackendUrl = () => {
  if (process.env.BACKEND_URL) {
    return process.env.BACKEND_URL;
  }
  // Default to localhost during development
  return 'http://localhost:3000';
};

const backendUrl = getBackendUrl();

export default function handler(req: VercelRequest, res: VercelResponse): void {
  // Remove /api prefix before forwarding to backend
  const path = req.url?.replace(/^\/api/, '') || '/';
  
  // Forward request to backend
  req.url = path;
  
  proxy.web(req, res, { target: backendUrl }, (error) => {
    if (error) {
      console.error('Proxy error:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Backend service unavailable',
        details: error.message 
      });
    }
  });
}
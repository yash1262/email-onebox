import { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // Simple test response
    res.setHeader('Content-Type', 'application/json');
    
    if (req.url?.includes('/health')) {
      res.json({
        success: true,
        status: 'Backend running on Vercel',
        timestamp: new Date().toISOString(),
        path: req.url
      });
      return;
    }

    if (req.url?.includes('/emails')) {
      res.json({
        success: true,
        data: [],
        count: 0,
        total: 0,
        message: 'Backend connected - database sync in progress'
      });
      return;
    }

    // Default response
    res.status(200).json({
      success: true,
      message: 'Backend is running',
      endpoints: {
        health: '/api/health',
        emails: '/api/emails',
        accounts: '/api/accounts'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}






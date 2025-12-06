import express, { Request, Response } from 'express';
import { ReplyController } from '../controllers/replyController';
import { CategorizeController } from '../controllers/categorizeController';

const router = express.Router();
const replyController = new ReplyController();
const categorizeController = new CategorizeController();

/**
 * AI-powered reply generation routes
 */

// Generate AI reply for a specific email
router.post('/reply/:emailId', (req: Request, res: Response) =>
  replyController.generateReply(req, res)
);

// Generate bulk AI replies for multiple emails
router.post('/reply/bulk', (req: Request, res: Response) =>
  replyController.generateBulkReplies(req, res)
);

/**
 * AI-powered categorization routes
 */

// Recategorize all emails (bulk) - MUST come before /:emailId route
router.post('/categorize/all', (req: Request, res: Response) =>
  categorizeController.recategorizeAll(req, res)
);

// Recategorize a single email
router.post('/categorize/:emailId', (req: Request, res: Response) =>
  categorizeController.recategorizeEmail(req, res)
);

export default router;

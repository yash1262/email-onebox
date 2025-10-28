import express, { Request, Response } from 'express';
import { ReplyController } from '../controllers/replyController';

const router = express.Router();
const replyController = new ReplyController();

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

export default router;

import express, { Request, Response } from 'express';
import { ElasticsearchService } from '../services/elasticsearch/ElasticsearchService';

const router = express.Router();
const elasticsearchService = new ElasticsearchService();

// Get all emails
router.get('/', async (req: Request, res: Response) => {
  try {
    const { accountEmail, folder, limit = '100' } = req.query;

    let emails;
    if (accountEmail && folder) {
      emails = await elasticsearchService.getEmailsByFolder(
        accountEmail as string,
        folder as string
      );
    } else if (accountEmail) {
      emails = await elasticsearchService.getEmailsByAccount(accountEmail as string);
    } else {
      // Get all emails with match_all
      emails = await elasticsearchService.searchEmails('', {});
    }

    // Apply limit
    const limitNum = parseInt(limit as string);
    const limitedEmails = emails.slice(0, limitNum);

    res.json({ 
      success: true, 
      data: limitedEmails, 
      count: limitedEmails.length,
      total: emails.length
    });
  } catch (error) {
    console.error('Error fetching emails:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch emails' });
  }
});

// Get email by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const email = await elasticsearchService.getEmailById(req.params.id);
    res.json({ success: true, data: email });
  } catch (error) {
    console.error('Error fetching email:', error);
    res.status(404).json({ success: false, error: 'Email not found' });
  }
});

// Get emails by category
router.get('/category/:category', async (req: Request, res: Response) => {
  try {
    const emails = await elasticsearchService.getEmailsByCategory(req.params.category);
    res.json({ success: true, data: emails, count: emails.length });
  } catch (error) {
    console.error('Error fetching emails by category:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch emails' });
  }
});

// Get statistics
router.get('/stats/overview', async (req: Request, res: Response) => {
  try {
    const stats = await elasticsearchService.getStats();
    res.json({ success: true, data: stats });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch stats' });
  }
});

export default router;

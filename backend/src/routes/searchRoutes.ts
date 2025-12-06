import express, { Request, Response } from 'express';
import { SearchService } from '../services/elasticsearch/SearchService';

const router = express.Router();
const searchService = new SearchService();

// Advanced search
router.post('/', async (req: Request, res: Response) => {
  try {
    const results = await searchService.advancedSearch(req.body);
    res.json({ success: true, data: results, count: results.length });
  } catch (error) {
    console.error('Error in search:', error);
    res.status(500).json({ success: false, error: 'Search failed' });
  }
});

// Simple query search
router.get('/', async (req: Request, res: Response) => {
  try {
    const { q, account, folder, category } = req.query;
    
    const results = await searchService.advancedSearch({
      query: q as string,
      accountEmail: account as string,
      folder: folder as string,
      category: category as string
    });

    res.json({ success: true, data: results, count: results.length });
  } catch (error) {
    console.error('Error in search:', error);
    res.status(500).json({ success: false, error: 'Search failed' });
  }
});

export default router;

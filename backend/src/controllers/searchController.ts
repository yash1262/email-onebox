import { Request, Response } from 'express';
import { SearchService } from '../services/elasticsearch/SearchService';
import { Logger } from '../utils/logger';

const searchService = new SearchService();

export class SearchController {
  /**
   * Advanced search with multiple filters
   */
  async advancedSearch(req: Request, res: Response): Promise<void> {
    try {
      const {
        query,
        accountEmail,
        folder,
        category,
        dateFrom,
        dateTo
      } = req.body;

      const results = await searchService.advancedSearch({
        query,
        accountEmail,
        folder,
        category,
        dateFrom: dateFrom ? new Date(dateFrom) : undefined,
        dateTo: dateTo ? new Date(dateTo) : undefined
      });

      res.json({
        success: true,
        data: results,
        count: results.length,
        query: {
          query,
          accountEmail,
          folder,
          category,
          dateFrom,
          dateTo
        }
      });
    } catch (error) {
      Logger.error('Error in advancedSearch:', error);
      res.status(500).json({
        success: false,
        error: 'Search failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Simple query search
   */
  async simpleSearch(req: Request, res: Response): Promise<void> {
    try {
      const { q, account, folder, category } = req.query;

      const results = await searchService.advancedSearch({
        query: q as string,
        accountEmail: account as string,
        folder: folder as string,
        category: category as string
      });

      res.json({
        success: true,
        data: results,
        count: results.length,
        query: q
      });
    } catch (error) {
      Logger.error('Error in simpleSearch:', error);
      res.status(500).json({
        success: false,
        error: 'Search failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Search by subject
   */
  async searchBySubject(req: Request, res: Response): Promise<void> {
    try {
      const { subject } = req.params;
      const results = await searchService.searchBySubject(subject);

      res.json({
        success: true,
        data: results,
        count: results.length,
        subject
      });
    } catch (error) {
      Logger.error('Error in searchBySubject:', error);
      res.status(500).json({
        success: false,
        error: 'Search failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Search by sender
   */
  async searchBySender(req: Request, res: Response): Promise<void> {
    try {
      const { sender } = req.params;
      const results = await searchService.searchBySender(sender);

      res.json({
        success: true,
        data: results,
        count: results.length,
        sender
      });
    } catch (error) {
      Logger.error('Error in searchBySender:', error);
      res.status(500).json({
        success: false,
        error: 'Search failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}

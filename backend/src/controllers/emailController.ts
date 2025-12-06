import { Request, Response } from 'express';
import { ElasticsearchService } from '../services/elasticsearch/ElasticsearchService';
import { Logger } from '../utils/logger';

const elasticsearchService = new ElasticsearchService();

export class EmailController {
  /**
   * Get all emails with optional filters
   */
  async getAllEmails(req: Request, res: Response): Promise<void> {
    try {
      const { accountEmail, folder, category, limit = 100 } = req.query;

      let emails;

      if (accountEmail && folder) {
        emails = await elasticsearchService.getEmailsByFolder(
          accountEmail as string,
          folder as string
        );
      } else if (accountEmail) {
        emails = await elasticsearchService.getEmailsByAccount(
          accountEmail as string
        );
      } else if (category) {
        emails = await elasticsearchService.getEmailsByCategory(
          category as string
        );
      } else {
        emails = await elasticsearchService.searchEmails('', {});
      }

      // Apply limit
      const limitedEmails = emails.slice(0, parseInt(limit as string));

      res.json({
        success: true,
        data: limitedEmails,
        count: limitedEmails.length,
        total: emails.length
      });
    } catch (error) {
      Logger.error('Error in getAllEmails:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch emails',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Get email by ID
   */
  async getEmailById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const email = await elasticsearchService.getEmailById(id);

      res.json({
        success: true,
        data: email
      });
    } catch (error) {
      Logger.error('Error in getEmailById:', error);
      res.status(404).json({
        success: false,
        error: 'Email not found',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Get emails by category
   */
  async getEmailsByCategory(req: Request, res: Response): Promise<void> {
    try {
      const { category } = req.params;
      const emails = await elasticsearchService.getEmailsByCategory(category);

      res.json({
        success: true,
        data: emails,
        count: emails.length,
        category
      });
    } catch (error) {
      Logger.error('Error in getEmailsByCategory:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch emails by category',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Get email statistics
   */
  async getEmailStats(req: Request, res: Response): Promise<void> {
    try {
      const stats = await elasticsearchService.getStats();

      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      Logger.error('Error in getEmailStats:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch statistics',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Get emails by account
   */
  async getEmailsByAccount(req: Request, res: Response): Promise<void> {
    try {
      const { accountEmail } = req.params;
      const emails = await elasticsearchService.getEmailsByAccount(accountEmail);

      res.json({
        success: true,
        data: emails,
        count: emails.length,
        accountEmail
      });
    } catch (error) {
      Logger.error('Error in getEmailsByAccount:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch emails by account',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Get emails by folder
   */
  async getEmailsByFolder(req: Request, res: Response): Promise<void> {
    try {
      const { accountEmail, folder } = req.params;
      const emails = await elasticsearchService.getEmailsByFolder(
        accountEmail,
        folder
      );

      res.json({
        success: true,
        data: emails,
        count: emails.length,
        accountEmail,
        folder
      });
    } catch (error) {
      Logger.error('Error in getEmailsByFolder:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch emails by folder',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}

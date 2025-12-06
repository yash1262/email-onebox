import { Request, Response } from 'express';
import { categorizeEmail } from '../services/ai/EmailCategorizer';
import { ElasticsearchService } from '../services/elasticsearch/ElasticsearchService';
import { indexEmail } from '../config/database';
import { Logger } from '../utils/logger';

const elasticsearchService = new ElasticsearchService();

export class CategorizeController {
  /**
   * Recategorize a single email
   */
  async recategorizeEmail(req: Request, res: Response): Promise<void> {
    try {
      const { emailId } = req.params;

      // Fetch email from Elasticsearch
      const email = await elasticsearchService.getEmailById(emailId);

      // Recategorize
      const newCategory = await categorizeEmail(email as any);

      // Update email in Elasticsearch
      const updatedEmail = {
        ...email,
        category: newCategory
      };

      await indexEmail(updatedEmail as any);

      res.json({
        success: true,
        data: {
          emailId,
          oldCategory: (email as any).category,
          newCategory
        }
      });
    } catch (error) {
      Logger.error('Error in recategorizeEmail:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to recategorize email',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Recategorize all emails (bulk operation)
   */
  async recategorizeAll(req: Request, res: Response): Promise<void> {
    try {
      const { limit = '100' } = req.query;
      const limitNum = parseInt(limit as string);

      // Get all emails
      const emails = await elasticsearchService.searchEmails('', {});
      const emailsToProcess = emails.slice(0, limitNum);

      Logger.info(`Recategorizing ${emailsToProcess.length} emails...`);

      const results = {
        processed: 0,
        updated: 0,
        unchanged: 0,
        errors: 0
      };

      for (const email of emailsToProcess) {
        try {
          const oldCategory = (email as any).category || 'Uncategorized';
          const newCategory = await categorizeEmail(email);

          if (oldCategory !== newCategory) {
            const updatedEmail = {
              ...email,
              category: newCategory
            };
            await indexEmail(updatedEmail as any);
            results.updated++;
          } else {
            results.unchanged++;
          }
          results.processed++;
        } catch (error) {
          Logger.error(`Error recategorizing email ${(email as any).messageId}:`, error);
          results.errors++;
        }
      }

      res.json({
        success: true,
        data: results,
        message: `Recategorization complete: ${results.updated} updated, ${results.unchanged} unchanged, ${results.errors} errors`
      });
    } catch (error) {
      Logger.error('Error in recategorizeAll:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to recategorize emails',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}


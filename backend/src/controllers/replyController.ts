import { Request, Response } from 'express';
import { RagService } from '../services/ai/RagService';
import { ElasticsearchService } from '../services/elasticsearch/ElasticsearchService';
import { Logger } from '../utils/logger';

const ragService = new RagService();
const elasticsearchService = new ElasticsearchService();

export class ReplyController {
  /**
   * Generate AI reply suggestion for an email
   */
  async generateReply(req: Request, res: Response): Promise<void> {
    try {
      const { emailId } = req.params;

      // Fetch email from Elasticsearch
      const email = await elasticsearchService.getEmailById(emailId);

      // Generate reply using RAG
      const suggestedReply = await ragService.generateReply(email as any);

      res.json({
        success: true,
        data: {
          emailId,
          email: {
            from: (email as any).from,
            subject: (email as any).subject,
            date: (email as any).date
          },
          suggestedReply
        }
      });
    } catch (error: any) {
      Logger.error('Error in generateReply:', error);
      
      // Check for Gemini API errors
      if (error.message?.includes('API key not configured') || error.message?.includes('Invalid Gemini API key')) {
        res.status(400).json({
          success: false,
          error: 'Gemini API key not configured',
          message: 'Please add GEMINI_API_KEY to your .env file. Get your API key from https://makersuite.google.com/app/apikey',
          code: 'GEMINI_API_KEY_MISSING'
        });
        return;
      }
      
      if (error.message?.includes('quota exceeded') || error.message?.includes('QUOTA_EXCEEDED')) {
        res.status(402).json({
          success: false,
          error: 'Gemini API quota exceeded',
          message: 'Please check your Gemini API usage limits',
          code: 'GEMINI_QUOTA_EXCEEDED'
        });
        return;
      }
      
      res.status(500).json({
        success: false,
        error: 'Failed to generate reply',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Generate bulk replies for multiple emails
   */
  async generateBulkReplies(req: Request, res: Response): Promise<void> {
    try {
      const { emailIds } = req.body;

      if (!Array.isArray(emailIds) || emailIds.length === 0) {
        res.status(400).json({
          success: false,
          error: 'Invalid email IDs array'
        });
        return;
      }

      const emails = await Promise.all(
        emailIds.map(id => elasticsearchService.getEmailById(id))
      );

      const replies = await ragService.generateBulkReplies(emails as any);

      const results = Array.from(replies.entries()).map((entry: any) => ({
        emailId: entry[0],
        suggestedReply: entry[1]
      }));

      res.json({
        success: true,
        data: results,
        count: results.length
      });
    } catch (error) {
      Logger.error('Error in generateBulkReplies:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to generate bulk replies',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}

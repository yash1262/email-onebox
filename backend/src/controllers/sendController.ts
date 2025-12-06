import { Request, Response } from 'express';
import { SmtpService } from '../services/smtp/SmtpService';
import { Logger } from '../utils/logger';

const smtpService = new SmtpService();

export class SendController {
  /**
   * Send an email
   */
  async sendEmail(req: Request, res: Response): Promise<void> {
    try {
      const { from, to, subject, body, html, inReplyTo, references } = req.body;

      // Validate required fields
      if (!from || !to || !subject || !body) {
        res.status(400).json({
          success: false,
          error: 'Missing required fields: from, to, subject, body'
        });
        return;
      }

      // Send email
      const result = await smtpService.sendEmail({
        from,
        to,
        subject,
        body,
        html,
        inReplyTo,
        references
      });

      if (result.success) {
        res.json({
          success: true,
          message: 'Email sent successfully',
          messageId: result.messageId
        });
      } else {
        res.status(500).json({
          success: false,
          error: result.error || 'Failed to send email'
        });
      }
    } catch (error) {
      Logger.error('Error in sendEmail:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to send email',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}

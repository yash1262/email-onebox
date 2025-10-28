import { indexEmail } from '../../config/database';
import { categorizeEmail } from '../ai/EmailCategorizer';
import { sendSlackNotification, triggerWebhook } from '../../config/slack';
import { Logger } from '../../utils/logger';

export interface EmailData {
  messageId: string;
  accountEmail: string;
  from: string;
  to: string;
  subject: string;
  body: string;
  html?: string;
  date: Date;
  folder: string;
  uid: number;
  flags: string[];
  timestamp: Date;
  category?: string;
  attachments?: Array<{
    filename: string;
    contentType: string;
    size: number;
  }>;
}

export class EmailProcessor {
  private processingQueue: Map<string, EmailData> = new Map();
  private processedIds: Set<string> = new Set();

  /**
   * Process a single email
   */
  async processEmail(emailData: EmailData): Promise<void> {
    try {
      // Check if already processed
      if (this.processedIds.has(emailData.messageId)) {
        Logger.debug(`Email already processed: ${emailData.messageId}`);
        return;
      }

      // Add to processing queue
      this.processingQueue.set(emailData.messageId, emailData);

      Logger.info(`Processing email: ${emailData.subject}`);

      // Step 1: Categorize with AI
      const category = await categorizeEmail(emailData);
      emailData.category = category;

      Logger.info(`Email categorized as: ${category}`);

      // Step 2: Index in Elasticsearch
      await indexEmail(emailData);
      Logger.info(`Email indexed: ${emailData.messageId}`);

      // Step 3: Send notifications for "Interested" emails
      if (category === 'Interested') {
        await this.handleInterestedEmail(emailData);
      }

      // Step 4: Mark as processed
      this.processingQueue.delete(emailData.messageId);
      this.processedIds.add(emailData.messageId);

      Logger.info(`Email processing completed: ${emailData.messageId}`);
    } catch (error) {
      Logger.error(`Error processing email ${emailData.messageId}:`, error);
      this.processingQueue.delete(emailData.messageId);
      throw error;
    }
  }

  /**
   * Process multiple emails in batch
   */
  async processBatch(emails: EmailData[]): Promise<{
    successful: number;
    failed: number;
    errors: any[];
  }> {
    Logger.info(`Processing batch of ${emails.length} emails`);

    const results = await Promise.allSettled(
      emails.map(email => this.processEmail(email))
    );

    const successful = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;
    const errors = results
      .filter((r): r is PromiseRejectedResult => r.status === 'rejected')
      .map(r => r.reason);

    Logger.info(`Batch processing completed: ${successful} success, ${failed} failed`);

    return { successful, failed, errors };
  }

  /**
   * Handle interested emails with notifications
   */
  private async handleInterestedEmail(emailData: EmailData): Promise<void> {
    try {
      Logger.info(`Handling interested email: ${emailData.messageId}`);

      // Send Slack notification
      await sendSlackNotification(emailData);
      Logger.info('Slack notification sent');

      // Trigger webhook
      await triggerWebhook(emailData);
      Logger.info('Webhook triggered');
    } catch (error) {
      Logger.error('Error handling interested email:', error);
      // Don't throw - notifications are non-critical
    }
  }

  /**
   * Get processing statistics
   */
  getStats(): {
    queueSize: number;
    processedCount: number;
    currentlyProcessing: string[];
  } {
    return {
      queueSize: this.processingQueue.size,
      processedCount: this.processedIds.size,
      currentlyProcessing: Array.from(this.processingQueue.keys())
    };
  }

  /**
   * Clear processed IDs cache (optional cleanup)
   */
  clearProcessedCache(): void {
    const cacheSize = this.processedIds.size;
    this.processedIds.clear();
    Logger.info(`Cleared processed IDs cache: ${cacheSize} entries`);
  }

  /**
   * Retry failed email processing
   */
  async retryEmail(messageId: string): Promise<void> {
    const emailData = this.processingQueue.get(messageId);
    
    if (!emailData) {
      throw new Error(`Email not found in queue: ${messageId}`);
    }

    await this.processEmail(emailData);
  }
}

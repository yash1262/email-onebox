import nodemailer from 'nodemailer';
import { Logger } from '../../utils/logger';
import { ElasticsearchService } from '../elasticsearch/ElasticsearchService';

const elasticsearchService = new ElasticsearchService();

export interface SendEmailParams {
  from: string;
  to: string;
  subject: string;
  body: string;
  html?: string;
  inReplyTo?: string;
  references?: string;
}

export class SmtpService {
  private transporter: nodemailer.Transporter | null = null;

  constructor() {
    this.initializeTransporter();
  }

  private initializeTransporter() {
    try {
      // Get SMTP config from environment
      const smtpHost = process.env.SMTP_HOST;
      const smtpPort = parseInt(process.env.SMTP_PORT || '587');
      const smtpUser = process.env.SMTP_USER;
      const smtpPass = process.env.SMTP_PASS;
      const smtpSecure = process.env.SMTP_SECURE === 'true';

      if (!smtpHost || !smtpUser || !smtpPass) {
        Logger.warn('SMTP credentials not configured. Email sending will be disabled.');
        return;
      }

      this.transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpSecure,
        auth: {
          user: smtpUser,
          pass: smtpPass
        }
      });

      Logger.info('SMTP service initialized successfully');
    } catch (error) {
      Logger.error('Failed to initialize SMTP service:', error);
    }
  }

  async sendEmail(params: SendEmailParams): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      if (!this.transporter) {
        throw new Error('SMTP service not configured');
      }

      const mailOptions: nodemailer.SendMailOptions = {
        from: params.from,
        to: params.to,
        subject: params.subject,
        text: params.body,
        html: params.html || params.body.replace(/\n/g, '<br>')
      };

      if (params.inReplyTo) {
        mailOptions.inReplyTo = params.inReplyTo;
      }

      if (params.references) {
        mailOptions.references = params.references;
      }

      const info = await this.transporter.sendMail(mailOptions);
      Logger.info(`Email sent successfully: ${info.messageId}`);

      // Index sent email to Elasticsearch
      await this.indexSentEmail(params, info.messageId);

      return {
        success: true,
        messageId: info.messageId
      };
    } catch (error) {
      Logger.error('Failed to send email:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private async indexSentEmail(params: SendEmailParams, messageId: string) {
    try {
      const emailData = {
        messageId,
        from: params.from,
        to: params.to,
        subject: params.subject,
        body: params.body,
        date: new Date().toISOString(),
        folder: 'SENT',
        accountEmail: params.from,
        category: 'Sent',
        isRead: true,
        inReplyTo: params.inReplyTo,
        references: params.references
      };

      await elasticsearchService.indexEmail(emailData);
      Logger.info(`Sent email indexed: ${messageId}`);
    } catch (error) {
      Logger.error('Failed to index sent email:', error);
    }
  }
}

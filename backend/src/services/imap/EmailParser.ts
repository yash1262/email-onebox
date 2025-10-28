import { simpleParser, ParsedMail } from 'mailparser';

export interface ParsedEmail {
  messageId: string;
  from: string;
  to: string;
  subject: string;
  body: string;
  html?: string;
  date: Date;
  attachments: Array<{
    filename: string;
    contentType: string;
    size: number;
  }>;
}

export class EmailParser {
  static async parse(rawEmail: string): Promise<ParsedEmail> {
    try {
      const parsed: ParsedMail = await simpleParser(rawEmail);

      return {
        messageId: parsed.messageId || '',
        from: parsed.from?.text || '',
        to: parsed.to?.text || '',
        subject: parsed.subject || '',
        body: parsed.text || '',
        html: parsed.html || undefined,
        date: parsed.date || new Date(),
        attachments: parsed.attachments.map(att => ({
          filename: att.filename || 'unknown',
          contentType: att.contentType,
          size: att.size
        }))
      };
    } catch (error) {
      console.error('Error parsing email:', error);
      throw error;
    }
  }

  static extractPlainText(html: string): string {
    // Simple HTML to plain text conversion
    return html
      .replace(/<style[^>]*>.*<\/style>/gm, '')
      .replace(/<script[^>]*>.*<\/script>/gm, '')
      .replace(/<[^>]+>/gm, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }
}

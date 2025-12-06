export interface Email {
  messageId: string;
  accountEmail: string;
  from: string;
  to: string;
  subject: string;
  body: string;
  html?: string;
  date: Date;
  folder: string;
  category?: EmailCategory;
  uid: number;
  flags: string[];
  timestamp: Date;
  attachments?: EmailAttachment[];
}

export interface EmailAttachment {
  filename: string;
  contentType: string;
  size: number;
  data?: Buffer;
}

export enum EmailCategory {
  INTERESTED = 'Interested',
  MEETING_BOOKED = 'Meeting Booked',
  NOT_INTERESTED = 'Not Interested',
  SPAM = 'Spam',
  OUT_OF_OFFICE = 'Out of Office',
  UNCATEGORIZED = 'Uncategorized'
}

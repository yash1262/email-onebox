export interface Email {
  id: string;
  messageId: string;
  accountEmail: string;
  from: string;
  to: string;
  subject: string;
  body: string;
  html?: string;
  date: string;
  folder: string;
  category?: Category;
  uid: number;
  flags: string[];
  timestamp: string;
  attachments?: EmailAttachment[];
}

export interface EmailAttachment {
  filename: string;
  contentType: string;
  size: number;
}

export enum Category {
  INTERESTED = 'Interested',
  MEETING_BOOKED = 'Meeting Booked',
  NOT_INTERESTED = 'Not Interested',
  SPAM = 'Spam',
  OUT_OF_OFFICE = 'Out of Office',
  UNCATEGORIZED = 'Uncategorized'
}

export const CATEGORY_COLORS: Record<Category, string> = {
  [Category.INTERESTED]: 'bg-green-100 text-green-800',
  [Category.MEETING_BOOKED]: 'bg-blue-100 text-blue-800',
  [Category.NOT_INTERESTED]: 'bg-red-100 text-red-800',
  [Category.SPAM]: 'bg-gray-100 text-gray-800',
  [Category.OUT_OF_OFFICE]: 'bg-yellow-100 text-yellow-800',
  [Category.UNCATEGORIZED]: 'bg-purple-100 text-purple-800'
};

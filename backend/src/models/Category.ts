export enum Category {
  INTERESTED = 'Interested',
  MEETING_BOOKED = 'Meeting Booked',
  NOT_INTERESTED = 'Not Interested',
  SPAM = 'Spam',
  OUT_OF_OFFICE = 'Out of Office',
  UNCATEGORIZED = 'Uncategorized'
}

export const CATEGORY_COLORS: Record<Category, string> = {
  [Category.INTERESTED]: '#10b981',
  [Category.MEETING_BOOKED]: '#3b82f6',
  [Category.NOT_INTERESTED]: '#ef4444',
  [Category.SPAM]: '#6b7280',
  [Category.OUT_OF_OFFICE]: '#f59e0b',
  [Category.UNCATEGORIZED]: '#8b5cf6'
};

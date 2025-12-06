export interface EmailSearchFilters {
  query?: string;
  accountEmail?: string;
  folder?: string;
  category?: string;
  dateFrom?: Date;
  dateTo?: Date;
  hasAttachments?: boolean;
  isUnread?: boolean;
}

export interface EmailSyncResult {
  accountEmail: string;
  folder: string;
  synced: number;
  failed: number;
  duration: number;
}

export interface EmailStats {
  total: number;
  byCategory: Record<string, number>;
  byAccount: Record<string, number>;
  byFolder: Record<string, number>;
}

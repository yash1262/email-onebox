export interface EmailAccount {
  email: string;
  status: 'connected' | 'disconnected' | 'syncing' | 'error';
  lastSync?: string;
  totalEmails?: number;
}

export interface AccountStats {
  total: number;
  byCategory: Record<string, number>;
  byAccount: Record<string, number>;
  byFolder: Record<string, number>;
}

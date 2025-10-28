export interface EmailAccount {
  email: string;
  provider: EmailProvider;
  host: string;
  port: number;
  status: AccountStatus;
  lastSyncedAt?: Date;
  totalEmails?: number;
  folders?: string[];
}

export enum EmailProvider {
  GMAIL = 'Gmail',
  OUTLOOK = 'Outlook',
  YAHOO = 'Yahoo',
  IMAP = 'IMAP',
  OTHER = 'Other'
}

export enum AccountStatus {
  CONNECTED = 'connected',
  DISCONNECTED = 'disconnected',
  SYNCING = 'syncing',
  ERROR = 'error'
}

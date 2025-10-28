import { ImapService } from '../imap/ImapService';
import { EmailProcessor } from './EmailProcessor';
import { EmailConfig } from '../../config/email';
import { Logger } from '../../utils/logger';

export class SyncManager {
  private imapServices: Map<string, ImapService> = new Map();
  private emailProcessor: EmailProcessor;
  private syncInterval: NodeJS.Timeout | null = null;
  private isRunning: boolean = false;

  constructor() {
    this.emailProcessor = new EmailProcessor();
  }

  /**
   * Initialize sync for multiple email accounts
   */
  async initialize(accounts: EmailConfig[]): Promise<void> {
    Logger.info('Initializing SyncManager...');

    for (const account of accounts) {
      try {
        const imapService = new ImapService(account);
        await imapService.connect();
        
        this.imapServices.set(account.user, imapService);
        Logger.info(`Connected: ${account.user}`);

        // Start initial sync
        await this.syncAccount(account.user);
      } catch (error) {
        Logger.error(`Failed to initialize ${account.user}:`, error);
      }
    }

    this.isRunning = true;
    Logger.info(`SyncManager initialized with ${this.imapServices.size} accounts`);
  }

  /**
   * Sync a specific email account
   */
  async syncAccount(email: string): Promise<void> {
    const imapService = this.imapServices.get(email);
    
    if (!imapService) {
      Logger.error(`IMAP service not found for ${email}`);
      return;
    }

    try {
      Logger.info(`Starting sync for ${email}`);
      await imapService.syncEmails('INBOX');
      Logger.info(`Sync completed for ${email}`);
    } catch (error) {
      Logger.error(`Sync failed for ${email}:`, error);
    }
  }

  /**
   * Sync all connected accounts
   */
  async syncAllAccounts(): Promise<void> {
    Logger.info('Syncing all accounts...');

    const syncPromises = Array.from(this.imapServices.keys()).map(email =>
      this.syncAccount(email)
    );

    await Promise.allSettled(syncPromises);
    Logger.info('All accounts synced');
  }

  /**
   * Start periodic sync (backup to IDLE mode)
   */
  startPeriodicSync(intervalMinutes: number = 5): void {
    if (this.syncInterval) {
      Logger.warn('Periodic sync already running');
      return;
    }

    const intervalMs = intervalMinutes * 60 * 1000;
    
    this.syncInterval = setInterval(async () => {
      Logger.info('Running periodic sync...');
      await this.syncAllAccounts();
    }, intervalMs);

    Logger.info(`Periodic sync started (every ${intervalMinutes} minutes)`);
  }

  /**
   * Stop periodic sync
   */
  stopPeriodicSync(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
      Logger.info('Periodic sync stopped');
    }
  }

  /**
   * Get sync status for all accounts
   */
  getSyncStatus(): { email: string; connected: boolean }[] {
    return Array.from(this.imapServices.entries()).map(([email, service]) => ({
      email,
      connected: (service as any).isConnected || false
    }));
  }

  /**
   * Manually trigger sync for specific folder
   */
  async syncFolder(email: string, folder: string): Promise<void> {
    const imapService = this.imapServices.get(email);
    
    if (!imapService) {
      throw new Error(`IMAP service not found for ${email}`);
    }

    Logger.info(`Syncing folder ${folder} for ${email}`);
    await imapService.syncEmails(folder);
  }

  /**
   * Reconnect a specific account
   */
  async reconnectAccount(email: string): Promise<void> {
    const imapService = this.imapServices.get(email);
    
    if (!imapService) {
      throw new Error(`IMAP service not found for ${email}`);
    }

    Logger.info(`Reconnecting ${email}...`);
    await imapService.disconnect();
    await imapService.connect();
    await this.syncAccount(email);
    Logger.info(`Reconnected ${email}`);
  }

  /**
   * Shutdown sync manager
   */
  async shutdown(): Promise<void> {
    Logger.info('Shutting down SyncManager...');

    this.stopPeriodicSync();
    this.isRunning = false;

    const disconnectPromises = Array.from(this.imapServices.values()).map(
      service => service.disconnect()
    );

    await Promise.allSettled(disconnectPromises);
    this.imapServices.clear();

    Logger.info('SyncManager shut down successfully');
  }

  /**
   * Get active connections count
   */
  getActiveConnectionsCount(): number {
    return this.imapServices.size;
  }

  /**
   * Check if manager is running
   */
  isActive(): boolean {
    return this.isRunning;
  }
}

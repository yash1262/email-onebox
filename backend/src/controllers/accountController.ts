import { Request, Response } from 'express';
import { syncManager } from '../server';
import { Logger } from '../utils/logger';
import { ElasticsearchService } from '../services/elasticsearch/ElasticsearchService';

const elasticsearchService = new ElasticsearchService();

export class AccountController {
  /**
   * Get all connected accounts
   */
  async getAllAccounts(req: Request, res: Response): Promise<void> {
    try {
      let accounts: any[] = [];
      const accountsFromSync = new Map<string, boolean>();

      // Get accounts from sync manager
      if (syncManager) {
        try {
          const status = syncManager.getSyncStatus();
          if (status && status.length > 0) {
            status.forEach(acc => {
              accountsFromSync.set(acc.email, acc.connected);
            });
          }
        } catch (syncError) {
          Logger.warn('Could not get accounts from sync manager');
        }
      }

      // Always get accounts from Elasticsearch to ensure we show all accounts with emails
      try {
        const stats: any = await elasticsearchService.getStats();
        const accountBuckets = stats.accounts?.buckets || [];
        
        const uniqueAccounts = new Set<string>();
        accountBuckets.forEach((bucket: any) => {
          if (bucket.key) {
            uniqueAccounts.add(bucket.key);
          }
        });

        accounts = Array.from(uniqueAccounts).map(email => ({
          email,
          status: accountsFromSync.has(email) && accountsFromSync.get(email) ? 'connected' : 'synced'
        }));

        Logger.info(`Found ${accounts.length} accounts (${accountsFromSync.size} from sync manager, ${uniqueAccounts.size} from Elasticsearch)`);
      } catch (esError) {
        Logger.error('Error getting accounts from Elasticsearch:', esError);
        
        // Fallback to sync manager only
        if (accountsFromSync.size > 0) {
          accounts = Array.from(accountsFromSync.entries()).map(([email, connected]) => ({
            email,
            status: connected ? 'connected' : 'disconnected'
          }));
        }
      }

      res.json({
        success: true,
        data: accounts,
        count: accounts.length
      });
    } catch (error) {
      Logger.error('Error in getAllAccounts:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch accounts',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Get account sync status
   */
  async getAccountStatus(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.params;

      if (!syncManager) {
        res.status(503).json({
          success: false,
          error: 'Sync manager not initialized'
        });
        return;
      }

      const status = syncManager.getSyncStatus();
      const accountStatus = status.find(acc => acc.email === email);

      if (!accountStatus) {
        res.status(404).json({
          success: false,
          error: 'Account not found'
        });
        return;
      }

      res.json({
        success: true,
        data: {
          email,
          status: accountStatus.connected ? 'connected' : 'disconnected',
          lastSync: new Date().toISOString()
        }
      });
    } catch (error) {
      Logger.error('Error in getAccountStatus:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch account status',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Trigger manual sync for account
   */
  async syncAccount(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.params;
      const { folder = 'INBOX' } = req.body;

      if (!syncManager) {
        res.status(503).json({
          success: false,
          error: 'Sync manager not initialized'
        });
        return;
      }

      await syncManager.syncFolder(email, folder);

      res.json({
        success: true,
        message: `Sync completed for ${email}/${folder}`
      });
    } catch (error) {
      Logger.error('Error in syncAccount:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to sync account',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}

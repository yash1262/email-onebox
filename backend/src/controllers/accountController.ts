import { Request, Response } from 'express';
import { syncManager } from '../server';
import { Logger } from '../utils/logger';

export class AccountController {
  /**
   * Get all connected accounts
   */
  async getAllAccounts(req: Request, res: Response): Promise<void> {
    try {
      if (!syncManager) {
        res.status(503).json({
          success: false,
          error: 'Sync manager not initialized'
        });
        return;
      }

      const status = syncManager.getSyncStatus();

      res.json({
        success: true,
        data: status,
        count: status.length
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

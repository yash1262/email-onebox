import { VercelRequest, VercelResponse } from '@vercel/node';
import dotenv from 'dotenv';

dotenv.config();

// Load the Express app
import app from '../backend/src/app';

// Initialize backend services on cold start
let initialized = false;

async function initializeBackend() {
  if (initialized) return;
  
  try {
    const { createEmailIndex } = await import('../backend/src/config/database');
    const { SyncManager } = await import('../backend/src/services/sync/SyncManager');
    const { emailAccounts } = await import('../backend/src/config/email');
    const { initializeVectorDB, storeProductContext } = await import('../backend/src/config/vector-db');
    const { Logger } = await import('../backend/src/utils/logger');

    Logger.info('🚀 Initializing backend services on Vercel...');

    try {
      Logger.info('📊 Setting up Elasticsearch...');
      await createEmailIndex();
    } catch (error) {
      Logger.warn('⚠️  Elasticsearch not available');
    }

    try {
      Logger.info('🧠 Setting up Vector DB...');
      await initializeVectorDB();
      await storeProductContext();
    } catch (error) {
      Logger.warn('⚠️  Vector DB not available');
    }

    try {
      Logger.info('📧 Connecting to email accounts...');
      const syncManager = new SyncManager();
      await syncManager.initialize(emailAccounts);
      syncManager.startPeriodicSync(5);
    } catch (error) {
      Logger.warn('⚠️  Email sync not available');
    }

    Logger.info('✅ Backend services initialized!');
    initialized = true;
  } catch (error) {
    console.error('Initialization error:', error);
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Initialize on first request
  if (!initialized) {
    await initializeBackend();
  }

  // Forward to Express app
  return app(req, res);
}

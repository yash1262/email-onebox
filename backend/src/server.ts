import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import { createEmailIndex } from './config/database';
import { SyncManager } from './services/sync/SyncManager';
import { emailAccounts } from './config/email';
import { initializeVectorDB, storeProductContext } from './config/vector-db';
import { Logger } from './utils/logger';

const PORT = process.env.PORT || 3000;

let syncManager: SyncManager;

async function initialize() {
  try {
    Logger.info('🚀 Initializing Email Onebox application...');

    // Initialize Elasticsearch (optional)
    try {
      Logger.info('📊 Setting up Elasticsearch...');
      await createEmailIndex();
    } catch (error) {
      Logger.warn('⚠️  Elasticsearch not available, continuing without it...');
    }

    // Initialize Vector DB (optional)
    try {
      Logger.info('🧠 Setting up Vector DB...');
      await initializeVectorDB();
      await storeProductContext();
    } catch (error) {
      Logger.warn('⚠️  Vector DB not available, continuing without it...');
    }

    // Initialize Sync Manager (optional)
    try {
      Logger.info('📧 Connecting to email accounts...');
      syncManager = new SyncManager();
      await syncManager.initialize(emailAccounts);
      // Start periodic sync (backup to IDLE)
      syncManager.startPeriodicSync(5);
    } catch (error) {
      Logger.warn('⚠️  Email sync not available, continuing without it...');
    }

    Logger.info('✅ Application initialized successfully!');
  } catch (error) {
    Logger.error('❌ Initialization failed:', error);
    process.exit(1);
  }
}

// Start server
app.listen(PORT, async () => {
  Logger.info(`🌐 Server running on http://localhost:${PORT}`);
  await initialize();
});

// Graceful shutdown
const shutdown = async (signal: string) => {
  Logger.info(`\n${signal} received. Shutting down gracefully...`);

  if (syncManager) {
    await syncManager.shutdown();
  }

  process.exit(0);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

export { syncManager };

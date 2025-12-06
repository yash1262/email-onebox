import { ImapService } from './ImapService';
import { EmailConfig } from '../../config/email';

export class ConnectionPool {
  private connections: Map<string, ImapService> = new Map();

  async addConnection(config: EmailConfig): Promise<void> {
    const imapService = new ImapService(config);
    await imapService.connect();
    await imapService.syncEmails('INBOX');
    
    this.connections.set(config.user, imapService);
    console.log(`Connection pool size: ${this.connections.size}`);
  }

  async initializeAll(configs: EmailConfig[]): Promise<void> {
    const promises = configs.map(config => this.addConnection(config));
    await Promise.all(promises);
    console.log('All IMAP connections initialized');
  }

  getConnection(email: string): ImapService | undefined {
    return this.connections.get(email);
  }

  async disconnectAll(): Promise<void> {
    const promises = Array.from(this.connections.values()).map(conn => 
      conn.disconnect()
    );
    await Promise.all(promises);
    this.connections.clear();
    console.log('All connections disconnected');
  }

  getActiveConnections(): string[] {
    return Array.from(this.connections.keys());
  }
}

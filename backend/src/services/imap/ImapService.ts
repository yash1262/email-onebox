import Imap from 'imap';
import { simpleParser } from 'mailparser';
import { EmailConfig, SYNC_DAYS } from '../../config/email';
import { indexEmail } from '../../config/database';
import { categorizeEmail } from '../ai/EmailCategorizer';
import { sendSlackNotification, triggerWebhook } from '../../config/slack';

export class ImapService {
  private imap: any;
  private config: EmailConfig;
  private isConnected: boolean = false;

  constructor(config: EmailConfig) {
    this.config = config;
  }

  async connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.imap = new Imap({
        user: this.config.user,
        password: this.config.password,
        host: this.config.host,
        port: this.config.port,
        tls: this.config.tls,
        tlsOptions: this.config.tlsOptions,
        keepalive: {
          interval: 10000,
          idleInterval: 300000,
          forceNoop: false
        },
        connTimeout: 10000,
        authTimeout: 5000
      });

      this.imap.once('ready', () => {
        console.log(`Connected to IMAP: ${this.config.user}`);
        this.isConnected = true;
        this.setupEventListeners();
        resolve();
      });

      this.imap.once('error', (err: Error) => {
        console.error(`IMAP Error for ${this.config.user}:`, err);
        this.isConnected = false;
        reject(err);
      });

      this.imap.once('end', () => {
        console.log(`Connection ended for ${this.config.user}`);
        this.isConnected = false;
        this.reconnect();
      });

      this.imap.connect();
    });
  }

  private setupEventListeners(): void {
    this.imap.on('mail', (numNewMsgs: number) => {
      console.log(`${numNewMsgs} new mail(s) received for ${this.config.user}`);
      this.fetchNewEmails();
    });

    this.imap.on('update', (seqno: number) => {
      console.log(`Email updated: ${seqno}`);
    });
  }

  private async reconnect(): Promise<void> {
    console.log(`Attempting to reconnect ${this.config.user} in 5 seconds...`);
    setTimeout(() => {
      this.connect().catch(console.error);
    }, 5000);
  }

  async syncEmails(folder: string = 'INBOX'): Promise<void> {
    return new Promise((resolve, reject) => {
      this.imap.openBox(folder, false, async (err: Error) => {
        if (err) {
          console.error(`Error opening ${folder}:`, err);
          reject(err);
          return;
        }

        const sinceDate = new Date();
        sinceDate.setDate(sinceDate.getDate() - SYNC_DAYS);

        const searchCriteria = [['SINCE', sinceDate]];

        this.imap.search(searchCriteria, async (err: Error, results: number[]) => {
          if (err) {
            console.error('Search error:', err);
            reject(err);
            return;
          }

          if (results.length === 0) {
            console.log(`No emails found in ${folder} for the last ${SYNC_DAYS} days`);
            this.startIdleMode();
            resolve();
            return;
          }

          console.log(`Found ${results.length} emails to sync from ${folder}`);

          const fetch = this.imap.fetch(results, {
            bodies: '',
            struct: true,
            markSeen: false
          });

          fetch.on('message', (msg: any, seqno: number) => {
            this.processMessage(msg, seqno, folder);
          });

          fetch.once('error', (err: Error) => {
            console.error('Fetch error:', err);
            reject(err);
          });

          fetch.once('end', () => {
            console.log(`Sync completed for ${folder}`);
            this.startIdleMode();
            resolve();
          });
        });
      });
    });
  }

  private processMessage(msg: any, seqno: number, folder: string): void {
    let buffer = '';
    let attributes: any;
    let bodyProcessed = false;
    let attributesReceived = false;

    const tryProcessEmail = async () => {
      // Only process when both body and attributes are ready
      if (!bodyProcessed || !attributesReceived) {
        return;
      }

      try {
        const parsed = await simpleParser(buffer);
        
        const emailData: any = {
          messageId: parsed.messageId || `${this.config.user}-${seqno}-${Date.now()}`,
          accountEmail: this.config.user,
          from: parsed.from?.text || '',
          to: (Array.isArray(parsed.to) ? parsed.to[0]?.text : parsed.to?.text) || '',
          subject: parsed.subject || '',
          body: parsed.text || (typeof parsed.html === 'string' ? parsed.html.substring(0, 5000) : '') || '',
          date: parsed.date || new Date(),
          folder: folder,
          uid: attributes?.uid || seqno,
          flags: attributes?.flags || [],
          timestamp: new Date(),
          category: 'Uncategorized'
        };

        // AI Categorization
        emailData.category = await categorizeEmail(emailData);

        // Index in Elasticsearch
        await indexEmail(emailData);

        // Send notifications for "Interested" emails
        if (emailData.category === 'Interested') {
          await sendSlackNotification(emailData);
          await triggerWebhook(emailData);
        }

        console.log(`Processed email: ${emailData.subject} [${emailData.category}]`);
      } catch (error) {
        console.error('Error processing email:', error);
      }
    };

    msg.on('body', (stream: any) => {
      stream.on('data', (chunk: Buffer) => {
        buffer += chunk.toString('utf8');
      });

      stream.once('end', () => {
        bodyProcessed = true;
        tryProcessEmail();
      });
    });

    msg.once('attributes', (attrs: any) => {
      attributes = attrs;
      attributesReceived = true;
      tryProcessEmail();
    });
  }

  private fetchNewEmails(): void {
    this.imap.openBox('INBOX', false, (err: Error) => {
      if (err) {
        console.error('Error opening INBOX for new mail:', err);
        return;
      }

      const fetch = this.imap.fetch(['*'], {
        bodies: '',
        struct: true,
        markSeen: false
      });

      fetch.on('message', (msg: any, seqno: number) => {
        this.processMessage(msg, seqno, 'INBOX');
      });

      fetch.once('end', () => {
        console.log('New emails processed');
        this.startIdleMode();
      });
    });
  }

  private startIdleMode(): void {
    if (this.imap && this.imap.state === 'authenticated') {
      try {
        // Start IDLE mode for real-time notifications
        this.imap.idle();
        console.log(`✅ IDLE mode activated for ${this.config.user}`);
        
        // Listen for new mail while in IDLE
        this.imap.once('mail', (numNewMsgs: number) => {
          console.log(`📧 ${numNewMsgs} new mail(s) received for ${this.config.user}`);
          // Exit IDLE mode to process new emails
          this.imap.done();
        });
        
        // When IDLE is done, process new emails and restart IDLE
        this.imap.once('idle:done', () => {
          console.log('IDLE done, processing new emails...');
          this.fetchNewEmails();
        });
        
        // Handle UID validity changes
        this.imap.on('uidvalidity', (uid: number) => {
          console.log(`UID validity: ${uid}`);
        });
      } catch (error) {
        console.error('Error starting IDLE:', error);
      }
    }
  }

  async disconnect(): Promise<void> {
    if (this.imap && this.isConnected) {
      this.imap.end();
    }
  }
}

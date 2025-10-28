import dotenv from 'dotenv';

dotenv.config();

export interface EmailConfig {
  user: string;
  password: string;
  host: string;
  port: number;
  tls: boolean;
  tlsOptions: {
    rejectUnauthorized: boolean;
  };
}

export const emailAccounts: EmailConfig[] = [
  {
    user: process.env.EMAIL1_USER!,
    password: process.env.EMAIL1_PASSWORD!,
    host: process.env.EMAIL1_HOST!,
    port: parseInt(process.env.EMAIL1_PORT || '993'),
    tls: true,
    tlsOptions: { rejectUnauthorized: false }
  },
  {
    user: process.env.EMAIL2_USER!,
    password: process.env.EMAIL2_PASSWORD!,
    host: process.env.EMAIL2_HOST!,
    port: parseInt(process.env.EMAIL2_PORT || '993'),
    tls: true,
    tlsOptions: { rejectUnauthorized: false }
  }
];

export const SYNC_DAYS = 30;

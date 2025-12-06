export interface ImapConfig {
  user: string;
  password: string;
  host: string;
  port: number;
  tls: boolean;
  tlsOptions?: {
    rejectUnauthorized: boolean;
  };
  keepalive?: {
    interval: number;
    idleInterval: number;
    forceNoop: boolean;
  };
}

export interface ImapMessage {
  seqno: number;
  uid: number;
  flags: string[];
  date: Date;
  size: number;
}

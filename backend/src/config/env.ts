import dotenv from 'dotenv';

dotenv.config();

export const config = {
  email: {
    accounts: [
      {
        user: process.env.EMAIL1_USER,
        password: process.env.EMAIL1_PASSWORD,
        host: process.env.EMAIL1_HOST,
        port: process.env.EMAIL1_PORT
      },
      {
        user: process.env.EMAIL2_USER,
        password: process.env.EMAIL2_PASSWORD,
        host: process.env.EMAIL2_HOST,
        port: process.env.EMAIL2_PORT
      }
    ],
    syncDays: 30
  },
  elasticsearch: {
    node: process.env.ELASTICSEARCH_NODE || 'http://localhost:9200'
  },
  slack: {
    webhookUrl: process.env.SLACK_WEBHOOK_URL
  },
  webhook: {
    url: process.env.WEBHOOK_URL
  },
  openai: {
    apiKey: process.env.OPENAI_API_KEY
  },
  qdrant: {
    url: process.env.QDRANT_URL || 'http://localhost:6333'
  },
  server: {
    port: process.env.PORT || 3000
  }
};

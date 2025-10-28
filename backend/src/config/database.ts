import { Client } from '@elastic/elasticsearch';
import dotenv from 'dotenv';

dotenv.config();

export const elasticsearchClient = new Client({
  node: process.env.ELASTICSEARCH_NODE || 'http://localhost:9200',
  requestTimeout: 30000,
  maxRetries: 3
});

export const EMAIL_INDEX = 'emails';

export const createEmailIndex = async () => {
  try {
    const indexExists = await elasticsearchClient.indices.exists({
      index: EMAIL_INDEX
    });

    if (!indexExists) {
      await elasticsearchClient.indices.create({
        index: EMAIL_INDEX,
        body: {
          mappings: {
            properties: {
              messageId: { type: 'keyword' },
              accountEmail: { type: 'keyword' },
              from: { type: 'text' },
              to: { type: 'text' },
              subject: { type: 'text' },
              body: { type: 'text' },
              date: { type: 'date' },
              folder: { type: 'keyword' },
              category: { type: 'keyword' },
              uid: { type: 'integer' },
              flags: { type: 'keyword' },
              timestamp: { type: 'date' }
            }
          }
        }
      });
      console.log(`Index ${EMAIL_INDEX} created successfully`);
    } else {
      console.log(`Index ${EMAIL_INDEX} already exists`);
    }
  } catch (error) {
    console.error('Error creating index:', error);
    throw error;
  }
};

export const indexEmail = async (email: any) => {
  try {
    await elasticsearchClient.index({
      index: EMAIL_INDEX,
      id: email.messageId,
      body: email,
      refresh: true
    });
    console.log(`Email indexed: ${email.messageId}`);
  } catch (error) {
    console.error('Error indexing email:', error);
    throw error;
  }
};

export const searchEmails = async (query: string, filters?: any) => {
  try {
    const must: any[] = [];

    if (query) {
      must.push({
        multi_match: {
          query,
          fields: ['subject^3', 'body', 'from', 'to'],
          fuzziness: 'AUTO'
        }
      });
    }

    if (filters?.folder) {
      must.push({ match: { folder: filters.folder } });
    }

    if (filters?.accountEmail) {
      must.push({ match: { accountEmail: filters.accountEmail } });
    }

    if (filters?.category) {
      must.push({ match: { category: filters.category } });
    }

    const result = await elasticsearchClient.search({
      index: EMAIL_INDEX,
      body: {
        query: must.length > 0 ? { bool: { must } } : { match_all: {} },
        sort: [{ date: { order: 'desc' } }],
        size: 100
      }
    });

    return result.hits.hits.map((hit: any) => ({
      id: hit._id,
      ...hit._source
    }));
  } catch (error) {
    console.error('Error searching emails:', error);
    throw error;
  }
};

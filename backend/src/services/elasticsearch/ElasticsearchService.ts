import { elasticsearchClient, EMAIL_INDEX, searchEmails as dbSearchEmails } from '../../config/database';

export class ElasticsearchService {
  async searchEmails(query: string, filters?: any) {
    try {
      return await dbSearchEmails(query, filters);
    } catch (error) {
      console.error('Error in Elasticsearch search:', error);
      throw error;
    }
  }

  async getEmailById(id: string) {
    try {
      const result = await elasticsearchClient.get({
        index: EMAIL_INDEX,
        id
      });

      return {
        id: result._id,
        ...(result._source as object)
      };
    } catch (error) {
      console.error('Error getting email by ID:', error);
      throw error;
    }
  }

  async getEmailsByAccount(accountEmail: string) {
    try {
      const result = await elasticsearchClient.search({
        index: EMAIL_INDEX,
        body: {
          query: {
            match: { accountEmail: accountEmail }
          },
          sort: [{ date: { order: 'desc' } }],
          size: 100
        }
      });

      return result.hits.hits.map((hit: any) => ({
        id: hit._id,
        ...hit._source
      }));
    } catch (error) {
      console.error('Error getting emails by account:', error);
      throw error;
    }
  }

  async getEmailsByFolder(accountEmail: string, folder: string) {
    try {
      const result = await elasticsearchClient.search({
        index: EMAIL_INDEX,
        body: {
          query: {
            bool: {
              must: [
                { match: { accountEmail: accountEmail } },
                { match: { folder: folder } }
              ]
            }
          },
          sort: [{ date: { order: 'desc' } }],
          size: 100
        }
      });

      return result.hits.hits.map((hit: any) => ({
        id: hit._id,
        ...hit._source
      }));
    } catch (error) {
      console.error('Error getting emails by folder:', error);
      throw error;
    }
  }

  async getEmailsByCategory(category: string) {
    try {
      const result = await elasticsearchClient.search({
        index: EMAIL_INDEX,
        body: {
          query: {
            match: { category: category }
          },
          sort: [{ date: { order: 'desc' } }],
          size: 100
        }
      });

      return result.hits.hits.map((hit: any) => ({
        id: hit._id,
        ...hit._source
      }));
    } catch (error) {
      console.error('Error getting emails by category:', error);
      throw error;
    }
  }

  async getStats() {
    try {
      const result = await elasticsearchClient.search({
        index: EMAIL_INDEX,
        body: {
          size: 0,
          aggs: {
            by_category: {
              terms: { field: 'category.keyword' }
            },
            by_account: {
              terms: { field: 'accountEmail.keyword' }
            },
            by_folder: {
              terms: { field: 'folder.keyword' }
            }
          }
        }
      });

      return {
        total: typeof result.hits.total === 'number' ? result.hits.total : result.hits.total?.value || 0,
        categories: result.aggregations?.by_category,
        accounts: result.aggregations?.by_account,
        folders: result.aggregations?.by_folder
      };
    } catch (error) {
      console.error('Error getting stats:', error);
      throw error;
    }
  }
}

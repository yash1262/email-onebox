import { searchEmails } from '../../config/database';

export class SearchService {
  async advancedSearch(params: {
    query?: string;
    accountEmail?: string;
    folder?: string;
    category?: string;
    dateFrom?: Date;
    dateTo?: Date;
  }) {
    try {
      const filters: any = {};

      if (params.accountEmail) filters.accountEmail = params.accountEmail;
      if (params.folder) filters.folder = params.folder;
      if (params.category) filters.category = params.category;

      const results = await searchEmails(params.query || '', filters);

      // Apply date filters if provided
      let filteredResults = results;
      if (params.dateFrom || params.dateTo) {
        filteredResults = results.filter((email: any) => {
          const emailDate = new Date(email.date);
          if (params.dateFrom && emailDate < params.dateFrom) return false;
          if (params.dateTo && emailDate > params.dateTo) return false;
          return true;
        });
      }

      return filteredResults;
    } catch (error) {
      console.error('Error in advanced search:', error);
      throw error;
    }
  }

  async searchBySubject(subject: string) {
    return await searchEmails(subject, {});
  }

  async searchBySender(sender: string) {
    return await searchEmails(sender, {});
  }
}

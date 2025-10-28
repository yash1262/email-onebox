import api from './api';
import { Email } from '../types/email.types';
import { ApiResponse, SearchFilters } from '../types/api.types';

export const searchService = {
  // Simple search
  simpleSearch: async (query: string, filters?: Partial<SearchFilters>): Promise<Email[]> => {
    const response = await api.get<ApiResponse<Email[]>>('/search', {
      params: { q: query, ...filters }
    });
    return response.data.data || [];
  },

  // Advanced search
  advancedSearch: async (filters: SearchFilters): Promise<Email[]> => {
    const response = await api.post<ApiResponse<Email[]>>('/search', filters);
    return response.data.data || [];
  },

  // Search by subject
  searchBySubject: async (subject: string): Promise<Email[]> => {
    const response = await api.get<ApiResponse<Email[]>>(`/search/subject/${subject}`);
    return response.data.data || [];
  },

  // Search by sender
  searchBySender: async (sender: string): Promise<Email[]> => {
    const response = await api.get<ApiResponse<Email[]>>(`/search/sender/${sender}`);
    return response.data.data || [];
  }
};

import api from './api';
import { Email, Category } from '../types/email.types';
import { ApiResponse } from '../types/api.types';

export const emailService = {
  // Get all emails
  getAllEmails: async (params?: {
    accountEmail?: string;
    folder?: string;
    category?: string;
    limit?: number;
  }): Promise<Email[]> => {
    const response = await api.get<ApiResponse<Email[]>>('/emails', { params });
    return response.data.data || [];
  },

  // Get email by ID
  getEmailById: async (id: string): Promise<Email> => {
    const response = await api.get<ApiResponse<Email>>(`/emails/${id}`);
    return response.data.data!;
  },

  // Get emails by category
  getEmailsByCategory: async (category: Category): Promise<Email[]> => {
    const response = await api.get<ApiResponse<Email[]>>(`/emails/category/${category}`);
    return response.data.data || [];
  },

  // Get email statistics
  getEmailStats: async () => {
    const response = await api.get<ApiResponse>('/emails/stats/overview');
    return response.data.data;
  },

  // Get emails by account
  getEmailsByAccount: async (accountEmail: string): Promise<Email[]> => {
    const response = await api.get<ApiResponse<Email[]>>(`/emails`, {
      params: { accountEmail }
    });
    return response.data.data || [];
  },

  // Get emails by folder
  getEmailsByFolder: async (accountEmail: string, folder: string): Promise<Email[]> => {
    const response = await api.get<ApiResponse<Email[]>>(`/emails`, {
      params: { accountEmail, folder }
    });
    return response.data.data || [];
  }
};

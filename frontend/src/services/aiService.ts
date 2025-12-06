import api from './api';
import { ApiResponse } from '../types/api.types';

export interface SuggestedReply {
  emailId: string;
  suggestedReply: string;
  email?: {
    from: string;
    subject: string;
    date: string;
  };
}

export const aiService = {
  // Generate reply for email
  generateReply: async (emailId: string): Promise<SuggestedReply> => {
    const response = await api.post<ApiResponse<SuggestedReply>>(`/ai/reply/${emailId}`);
    return response.data.data!;
  },

  // Generate bulk replies
  generateBulkReplies: async (emailIds: string[]): Promise<SuggestedReply[]> => {
    const response = await api.post<ApiResponse<SuggestedReply[]>>('/ai/reply/bulk', {
      emailIds
    });
    return response.data.data || [];
  },

  // Recategorize email
  recategorizeEmail: async (emailId: string): Promise<{ category: string }> => {
    const response = await api.post<ApiResponse<{ category: string }>>(
      `/ai/categorize/${emailId}`
    );
    return response.data.data!;
  }
};

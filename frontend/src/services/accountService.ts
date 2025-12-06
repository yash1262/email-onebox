import api from './api';
import { EmailAccount } from '../types/account.types';
import { ApiResponse } from '../types/api.types';

export const accountService = {
  // Get all accounts
  getAllAccounts: async (): Promise<EmailAccount[]> => {
    const response = await api.get<ApiResponse<EmailAccount[]>>('/accounts');
    return response.data.data || [];
  },

  // Get account status
  getAccountStatus: async (email: string): Promise<EmailAccount> => {
    const response = await api.get<ApiResponse<EmailAccount>>(`/accounts/${email}/status`);
    return response.data.data!;
  },

  // Trigger account sync
  syncAccount: async (email: string, folder: string = 'INBOX'): Promise<void> => {
    await api.post(`/accounts/${email}/sync`, { folder });
  }
};

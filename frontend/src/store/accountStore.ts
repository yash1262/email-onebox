import { create } from 'zustand';
import { EmailAccount } from '../types/account.types';

interface AccountStore {
  accounts: EmailAccount[];
  selectedAccount: string | null;
  isLoading: boolean;
  
  setAccounts: (accounts: EmailAccount[]) => void;
  setSelectedAccount: (account: string | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useAccountStore = create<AccountStore>((set) => ({
  accounts: [],
  selectedAccount: null,
  isLoading: false,

  setAccounts: (accounts) => set({ accounts }),
  setSelectedAccount: (account) => set({ selectedAccount: account }),
  setLoading: (loading) => set({ isLoading: loading })
}));

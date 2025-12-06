import { create } from 'zustand';
import { Email, Category } from '../types/email.types';

interface EmailStore {
  emails: Email[];
  selectedEmail: Email | null;
  isLoading: boolean;
  error: string | null;
  
  setEmails: (emails: Email[]) => void;
  setSelectedEmail: (email: Email | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearEmails: () => void;
}

export const useEmailStore = create<EmailStore>((set) => ({
  emails: [],
  selectedEmail: null,
  isLoading: false,
  error: null,

  setEmails: (emails) => set({ emails, error: null }),
  setSelectedEmail: (email) => set({ selectedEmail: email }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  clearEmails: () => set({ emails: [], selectedEmail: null, error: null })
}));

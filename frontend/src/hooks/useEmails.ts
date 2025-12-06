import { useQuery, useQueryClient } from '@tanstack/react-query';
import { emailService } from '../services/emailService';
import { useEmailStore } from '../store/emailStore';
import { Category } from '../types/email.types';

export const useEmails = (filters?: {
  accountEmail?: string;
  folder?: string;
  category?: string;
}) => {
  const { setEmails, setLoading, setError } = useEmailStore();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['emails', filters],
    queryFn: async () => {
      setLoading(true);
      setError(null);
      try {
        const emails = await emailService.getAllEmails(filters);
        console.log('✅ Emails loaded:', emails.length, 'emails');
        setEmails(emails);
        return emails;
      } catch (error: any) {
        const errorMessage = error.response?.data?.error || error.message || 'Failed to load emails';
        console.error('❌ Error loading emails:', errorMessage, error);
        setError(errorMessage);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    refetchInterval: 30000, // Refetch every 30 seconds
    retry: 2, // Retry failed requests 2 times
    staleTime: 10000 // Consider data fresh for 10 seconds
  });

  const refetch = () => {
    queryClient.invalidateQueries({ queryKey: ['emails'] });
  };

  return { ...query, refetch };
};

export const useEmailById = (id: string) => {
  return useQuery({
    queryKey: ['email', id],
    queryFn: () => emailService.getEmailById(id),
    enabled: !!id
  });
};

export const useEmailsByCategory = (category: Category) => {
  return useQuery({
    queryKey: ['emails', 'category', category],
    queryFn: () => emailService.getEmailsByCategory(category)
  });
};

export const useEmailStats = () => {
  return useQuery({
    queryKey: ['emailStats'],
    queryFn: () => emailService.getEmailStats(),
    refetchInterval: 60000
  });
};

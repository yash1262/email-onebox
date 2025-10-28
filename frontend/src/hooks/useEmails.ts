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
      try {
        const emails = await emailService.getAllEmails(filters);
        setEmails(emails);
        return emails;
      } catch (error: any) {
        setError(error.message);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    refetchInterval: 30000 // Refetch every 30 seconds
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

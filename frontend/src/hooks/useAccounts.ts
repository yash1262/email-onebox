import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { accountService } from '../services/accountService';
import { useAccountStore } from '../store/accountStore';

export const useAccounts = () => {
  const { setAccounts, setLoading } = useAccountStore();

  const query = useQuery({
    queryKey: ['accounts'],
    queryFn: async () => {
      setLoading(true);
      try {
        const accounts = await accountService.getAllAccounts();
        setAccounts(accounts);
        return accounts;
      } finally {
        setLoading(false);
      }
    }
  });

  return query;
};

export const useAccountSync = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ email, folder }: { email: string; folder?: string }) =>
      accountService.syncAccount(email, folder),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emails'] });
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
    }
  });
};

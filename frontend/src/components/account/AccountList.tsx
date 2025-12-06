import React from 'react';
import { CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { Button } from '../common/Button';
import { useAccounts, useAccountSync } from '../../hooks/useAccounts';
import { Loader } from '../common/Loader';

export const AccountList: React.FC = () => {
  const { data: accounts, isLoading } = useAccounts();
  const syncMutation = useAccountSync();

  const handleSync = (email: string) => {
    syncMutation.mutate({ email });
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="space-y-3">
      {accounts?.map((account) => (
        <div
          key={account.email}
          className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg"
        >
          <div className="flex items-center gap-3">
            {account.status === 'connected' ? (
              <CheckCircle size={20} className="text-green-500" />
            ) : (
              <XCircle size={20} className="text-red-500" />
            )}
            <div>
              <p className="font-medium text-gray-900">{account.email}</p>
              <p className="text-sm text-gray-500 capitalize">{account.status}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleSync(account.email)}
            isLoading={syncMutation.isPending}
          >
            <RefreshCw size={16} />
          </Button>
        </div>
      ))}
    </div>
  );
};

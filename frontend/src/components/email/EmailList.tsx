import React from 'react';
import { EmailItem } from './EmailItem';
import { Loader } from '../common/Loader';
import { useEmails } from '../../hooks/useEmails';
import { useEmailStore } from '../../store/emailStore';
import { useAccountStore } from '../../store/accountStore';
import { useUiStore } from '../../store/uiStore';

export const EmailList: React.FC = () => {
  const { selectedAccount } = useAccountStore();
  const { selectedFolder, selectedCategory, searchQuery } = useUiStore();
  const { emails, selectedEmail, setSelectedEmail, isLoading: storeLoading, error: storeError } = useEmailStore();

  const { isLoading: queryLoading, error: queryError } = useEmails({
    accountEmail: selectedAccount || undefined,
    folder: selectedFolder || undefined,
    category: selectedCategory || undefined
  });

  const isLoading = queryLoading || storeLoading;
  const error = queryError || storeError;

  // Filter emails based on search query
  const filteredEmails = React.useMemo(() => {
    if (!searchQuery || searchQuery.trim() === '') {
      return emails;
    }
    
    const query = searchQuery.toLowerCase();
    return emails.filter(email => 
      email.subject?.toLowerCase().includes(query) ||
      email.from?.toLowerCase().includes(query) ||
      email.body?.toLowerCase().includes(query) ||
      email.to?.toLowerCase().includes(query)
    );
  }, [emails, searchQuery]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-red-600 font-semibold mb-2">Error loading emails</p>
          <p className="text-gray-600 text-sm">{error.toString()}</p>
        </div>
      </div>
    );
  }

  if (!filteredEmails || filteredEmails.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-gray-500 text-lg mb-2">
            {searchQuery ? 'No emails match your search' : 'No emails found'}
          </p>
          <p className="text-gray-400 text-sm">
            {searchQuery ? 'Try a different search term' : 'Try adjusting your filters or syncing your accounts'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-200">
      {filteredEmails.map((email) => (
        <EmailItem
          key={email.id}
          email={email}
          isSelected={selectedEmail?.id === email.id}
          onClick={() => setSelectedEmail(email)}
        />
      ))}
    </div>
  );
};

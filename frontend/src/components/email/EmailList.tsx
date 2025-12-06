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
      <div className="flex items-center justify-center h-full p-8">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-50 flex items-center justify-center">
            <span className="text-2xl">⚠️</span>
          </div>
          <p className="text-red-600 font-semibold mb-2 text-base">Error loading emails</p>
          <p className="text-gray-600 text-sm mb-5 leading-relaxed">{error.toString()}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all shadow-medium text-sm font-semibold"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!filteredEmails || filteredEmails.length === 0) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
            <span className="text-2xl">📭</span>
          </div>
          <p className="text-gray-700 text-base font-semibold mb-2">
            {searchQuery ? 'No emails match your search' : 'No emails found'}
          </p>
          <p className="text-gray-500 text-sm mb-5 leading-relaxed">
            {searchQuery ? 'Try a different search term' : 'Try adjusting your filters or syncing your accounts'}
          </p>
          {!searchQuery && (
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all shadow-medium text-sm font-semibold"
            >
              Refresh
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-100/80">
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

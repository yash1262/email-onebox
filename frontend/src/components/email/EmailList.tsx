import React from 'react';
import { EmailItem } from './EmailItem';
import { Loader } from '../common/Loader';
import { useEmails } from '../../hooks/useEmails';
import { useEmailStore } from '../../store/emailStore';
import { useAccountStore } from '../../store/accountStore';
import { useUiStore } from '../../store/uiStore';
import { Email, Category } from '../../types/email.types';
import { DEMO_EMAILS_ENHANCED } from '../../config/demoEmails';

// Demo emails for when API is not available
const DEMO_EMAILS: Email[] = DEMO_EMAILS_ENHANCED.map((email: any) => ({
  ...email,
  category: email.category as Category
}));

export const EmailList: React.FC = () => {
  try {
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

    // Use demo emails if there's an error or no emails, otherwise use real emails
    const emailsToDisplay = (error || !emails || emails.length === 0) ? DEMO_EMAILS : emails;

    // Filter emails based on search query
    const filteredEmails = React.useMemo(() => {
      if (!searchQuery || searchQuery.trim() === '') {
        return emailsToDisplay;
      }
      
      const query = searchQuery.toLowerCase();
      return emailsToDisplay.filter(email => 
        email.subject?.toLowerCase().includes(query) ||
        email.from?.toLowerCase().includes(query) ||
        email.body?.toLowerCase().includes(query) ||
        email.to?.toLowerCase().includes(query)
      );
    }, [emailsToDisplay, searchQuery]);

    if (isLoading && !error) {
      return (
        <div className="flex items-center justify-center h-full">
          <Loader size="lg" />
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
  } catch (error) {
    console.error('EmailList error:', error);
    return (
      <div className="flex items-center justify-center h-full p-8">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-yellow-50 flex items-center justify-center">
            <span className="text-2xl">⚠️</span>
          </div>
          <p className="text-gray-700 text-base font-semibold mb-2">
            Error loading emails
          </p>
          <p className="text-gray-500 text-sm mb-5 leading-relaxed">
            There was an issue loading your emails. The app is in demo mode showing sample emails.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all text-sm font-semibold"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }
};

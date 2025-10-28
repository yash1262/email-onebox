import React from 'react';
import { EmailList } from '../components/email/EmailList';
import { EmailDetail } from '../components/email/EmailDetail';
import { CategoryFilter } from '../components/ai/CategoryFilter';
import { useEmailStore } from '../store/emailStore';

export const HomePage: React.FC = () => {
  const { selectedEmail } = useEmailStore();

  return (
    <div className="h-full flex">
      {/* Email List */}
      <div className={`${selectedEmail ? 'hidden lg:block' : 'flex-1'} lg:w-96 xl:w-[500px] border-r border-gray-200 bg-white flex flex-col`}>
        <CategoryFilter />
        <div className="flex-1 overflow-y-auto">
          <EmailList />
        </div>
      </div>

      {/* Email Detail */}
      <div className={`${selectedEmail ? 'flex-1' : 'hidden lg:block lg:flex-1'}`}>
        {selectedEmail ? (
          <EmailDetail email={selectedEmail} />
        ) : (
          <div className="h-full flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <p className="text-gray-500 text-lg">Select an email to read</p>
              <p className="text-gray-400 text-sm mt-2">
                Choose a message from the list to view its contents
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

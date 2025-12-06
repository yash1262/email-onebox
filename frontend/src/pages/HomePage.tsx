import React from 'react';
import { EmailList } from '../components/email/EmailList';
import { EmailDetail } from '../components/email/EmailDetail';
import { CategoryFilter } from '../components/ai/CategoryFilter';
import { useEmailStore } from '../store/emailStore';

export const HomePage: React.FC = () => {
  try {
    const { selectedEmail } = useEmailStore();

    return (
      <div className="h-full flex bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50/20">
        {/* Email List */}
        <div className={`${selectedEmail ? 'hidden lg:block' : 'flex-1'} lg:w-96 xl:w-[500px] border-r border-gray-200/60 bg-white/80 backdrop-blur-sm flex flex-col`}>
          <CategoryFilter />
          <div className="flex-1 overflow-y-auto">
            <EmailList />
          </div>
        </div>

        {/* Email Detail */}
        <div className={`${selectedEmail ? 'flex-1' : 'hidden lg:block lg:flex-1'} bg-white`}>
          {selectedEmail ? (
            <EmailDetail email={selectedEmail} />
          ) : (
            <div className="h-full flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
              <div className="text-center max-w-md px-6">
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center shadow-lg shadow-blue-100/50">
                  <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-gray-900 text-xl font-bold mb-2">Select an email</p>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Choose a message from the list to view its contents and generate AI-powered replies
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  } catch (error) {
    console.error('HomePage error:', error);
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-900 text-lg font-semibold mb-2">Unable to load page</p>
          <p className="text-gray-500 text-sm mb-4">There was an error loading the email interface</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }
};

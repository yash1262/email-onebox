import React from 'react';
import { Inbox, Send, Star, Trash2, Archive, Tag } from 'lucide-react';
import { useAccounts } from '../../hooks/useAccounts';
import { useUiStore } from '../../store/uiStore';
import { useAccountStore } from '../../store/accountStore';
import { useEmailStats } from '../../hooks/useEmails';
import { Category, CATEGORY_COLORS } from '../../types/email.types';

export const Sidebar: React.FC = () => {
  try {
    const { data: accounts = [] } = useAccounts() || { data: [] };
    const { data: stats } = useEmailStats() || { data: undefined };
    const { sidebarOpen, selectedFolder, selectedCategory, setSelectedFolder, setSelectedCategory } = useUiStore();
    const { selectedAccount, setSelectedAccount } = useAccountStore();

    const folders = [
      { name: 'INBOX', icon: Inbox, label: 'Inbox' },
      { name: 'SENT', icon: Send, label: 'Sent' },
      { name: 'STARRED', icon: Star, label: 'Starred' },
      { name: 'TRASH', icon: Trash2, label: 'Trash' },
      { name: 'ARCHIVE', icon: Archive, label: 'Archive' }
    ];

    const categories = Object.values(Category);

    if (!sidebarOpen) return null;

  return (
    <aside className="w-64 bg-white border-r border-gray-200/80 flex flex-col overflow-hidden shadow-soft">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-gray-200/80 bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">OneBox</h1>
            <p className="text-xs text-gray-500 font-medium">AI Email Manager</p>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Accounts */}
        <div className="px-4 py-5">
          <h2 className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-3 px-2">
            Accounts
          </h2>
          <div className="space-y-0.5">
            <button
              onClick={() => setSelectedAccount(null)}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                !selectedAccount
                  ? 'bg-primary-50 text-primary-700 shadow-soft'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              All Accounts
            </button>
            {accounts?.map((account) => (
              <button
                key={account.email}
                onClick={() => setSelectedAccount(account.email)}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                  selectedAccount === account.email
                    ? 'bg-primary-50 text-primary-700 font-medium shadow-soft'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate text-xs">{account.email}</span>
                  <span
                    className={`w-2 h-2 rounded-full flex-shrink-0 ${
                      account.status === 'connected'
                        ? 'bg-emerald-500 shadow-sm shadow-emerald-500/50'
                        : 'bg-red-500 shadow-sm shadow-red-500/50'
                    }`}
                  />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Folders */}
        <div className="px-4 py-5 border-t border-gray-200/60">
          <h2 className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-3 px-2">
            Folders
          </h2>
          <div className="space-y-0.5">
            {folders.map((folder) => {
              const Icon = folder.icon;
              return (
                <button
                  key={folder.name}
                  onClick={() => {
                    setSelectedFolder(folder.name);
                    setSelectedCategory(null);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                    selectedFolder === folder.name && !selectedCategory
                      ? 'bg-primary-50 text-primary-700 font-medium shadow-soft'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon size={18} className="flex-shrink-0" />
                  <span className="flex-1 text-left">{folder.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Categories */}
        <div className="px-4 py-5 border-t border-gray-200/60">
          <h2 className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-3 px-2">
            AI Categories
          </h2>
          <div className="space-y-0.5">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => {
                  setSelectedCategory(category);
                  setSelectedFolder('INBOX');
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                  selectedCategory === category
                    ? 'bg-primary-50 text-primary-700 font-medium shadow-soft'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Tag size={16} className="flex-shrink-0" />
                <span className="flex-1 text-left text-xs">{category}</span>
                {stats?.byCategory?.[category] && (
                  <span className="text-xs font-medium text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                    {stats.byCategory[category]}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </aside>
    );
  } catch (error) {
    console.error('Sidebar error:', error);
    return (
      <aside className="w-64 bg-white border-r border-gray-200/80 flex flex-col overflow-hidden shadow-soft">
        <div className="px-6 py-6 border-b border-gray-200/80">
          <h1 className="text-xl font-bold text-gray-900">OneBox</h1>
        </div>
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center text-sm text-gray-500">
            <p>Unable to load sidebar</p>
          </div>
        </div>
      </aside>
    );
  }
};

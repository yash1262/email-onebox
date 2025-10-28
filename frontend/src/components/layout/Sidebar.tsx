import React from 'react';
import { Inbox, Send, Star, Trash2, Archive, Tag } from 'lucide-react';
import { useAccounts } from '../../hooks/useAccounts';
import { useUiStore } from '../../store/uiStore';
import { useAccountStore } from '../../store/accountStore';
import { useEmailStats } from '../../hooks/useEmails';
import { Category, CATEGORY_COLORS } from '../../types/email.types';

export const Sidebar: React.FC = () => {
  const { data: accounts } = useAccounts();
  const { data: stats } = useEmailStats();
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
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col overflow-hidden">
      {/* Logo */}
      <div className="p-6 border-b">
        <h1 className="text-2xl font-bold text-blue-600">📧 OneBox</h1>
        <p className="text-sm text-gray-500 mt-1">Intelligent Email Hub</p>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Accounts */}
        <div className="p-4">
          <h2 className="text-xs font-semibold text-gray-500 uppercase mb-3">
            Accounts
          </h2>
          <div className="space-y-1">
            <button
              onClick={() => setSelectedAccount(null)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                !selectedAccount
                  ? 'bg-blue-50 text-blue-700 font-medium'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              All Accounts
            </button>
            {accounts?.map((account) => (
              <button
                key={account.email}
                onClick={() => setSelectedAccount(account.email)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  selectedAccount === account.email
                    ? 'bg-blue-50 text-blue-700 font-medium'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="truncate">{account.email}</span>
                  <span
                    className={`w-2 h-2 rounded-full ${
                      account.status === 'connected'
                        ? 'bg-green-500'
                        : 'bg-red-500'
                    }`}
                  />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Folders */}
        <div className="p-4 border-t">
          <h2 className="text-xs font-semibold text-gray-500 uppercase mb-3">
            Folders
          </h2>
          <div className="space-y-1">
            {folders.map((folder) => {
              const Icon = folder.icon;
              return (
                <button
                  key={folder.name}
                  onClick={() => {
                    setSelectedFolder(folder.name);
                    setSelectedCategory(null);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                    selectedFolder === folder.name && !selectedCategory
                      ? 'bg-blue-50 text-blue-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon size={18} />
                  <span>{folder.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Categories */}
        <div className="p-4 border-t">
          <h2 className="text-xs font-semibold text-gray-500 uppercase mb-3">
            AI Categories
          </h2>
          <div className="space-y-1">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => {
                  setSelectedCategory(category);
                  setSelectedFolder('INBOX');
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                  selectedCategory === category
                    ? 'bg-blue-50 text-blue-700 font-medium'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Tag size={18} />
                <span className="flex-1 text-left">{category}</span>
                {stats?.byCategory?.[category] && (
                  <span className="text-xs text-gray-500">
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
};

import React, { useState } from 'react';
import { Search, RefreshCw, Settings, Menu } from 'lucide-react';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { useUiStore } from '../../store/uiStore';
import { useEmails } from '../../hooks/useEmails';

export const Header: React.FC = () => {
  const { toggleSidebar, setSearchQuery, searchQuery } = useUiStore();
  const { refetch } = useEmails();
  const [localQuery, setLocalQuery] = useState(searchQuery);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(localQuery);
    // Trigger email refetch with search query
    refetch();
  };

  const handleRefresh = () => {
    refetch();
  };

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-gray-200/60 sticky top-0 z-30 shadow-sm">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Left Section */}
          <div className="flex items-center gap-4 flex-1">
            <button
              onClick={toggleSidebar}
              className="p-2.5 hover:bg-gray-100 rounded-xl transition-all lg:hidden text-gray-600 hover:text-gray-900"
            >
              <Menu size={20} />
            </button>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex-1 max-w-2xl">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search size={18} className="text-gray-400" />
                </div>
                <Input
                  type="search"
                  placeholder="Search emails by subject, sender, or content..."
                  value={localQuery}
                  onChange={(e) => setLocalQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 bg-gray-50/80 border-gray-200/60 rounded-xl focus:bg-white focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>
            </form>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              title="Refresh emails"
              className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl p-2.5"
            >
              <RefreshCw size={18} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              title="Settings"
              className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl p-2.5"
            >
              <Settings size={18} />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

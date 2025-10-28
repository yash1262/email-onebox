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
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between gap-4">
        {/* Left Section */}
        <div className="flex items-center gap-4 flex-1">
          <button
            onClick={toggleSidebar}
            className="p-2 hover:bg-gray-100 rounded-lg lg:hidden"
          >
            <Menu size={20} />
          </button>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex-1 max-w-2xl">
            <Input
              type="search"
              placeholder="Search emails by subject, sender, or content..."
              value={localQuery}
              onChange={(e) => setLocalQuery(e.target.value)}
              icon={<Search size={20} className="text-gray-400" />}
              className="w-full"
            />
          </form>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            title="Refresh emails"
          >
            <RefreshCw size={18} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            title="Settings"
          >
            <Settings size={18} />
          </Button>
        </div>
      </div>
    </header>
  );
};

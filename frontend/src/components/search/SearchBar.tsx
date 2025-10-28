import React, { useState } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '../common/Input';
import { useSearch } from '../../hooks/useSearch';

export const SearchBar: React.FC = () => {
  const [query, setQuery] = useState('');
  const { search, clearSearch } = useSearch();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      search({ query: query.trim() });
    }
  };

  const handleClear = () => {
    setQuery('');
    clearSearch();
  };

  return (
    <form onSubmit={handleSearch} className="relative">
      <Input
        type="search"
        placeholder="Search emails..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        icon={<Search size={20} className="text-gray-400" />}
        className="pr-10"
      />
      {query && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          <X size={20} />
        </button>
      )}
    </form>
  );
};

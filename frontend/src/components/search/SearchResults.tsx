import React from 'react';
import { EmailList } from '../email/EmailList';
import { useSearch } from '../../hooks/useSearch';
import { Loader } from '../common/Loader';

export const SearchResults: React.FC = () => {
  const { data, isLoading, filters } = useSearch();

  if (!filters.query && !filters.accountEmail && !filters.category) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div>
      <div className="px-6 py-4 bg-gray-50 border-b">
        <h2 className="text-lg font-semibold text-gray-900">
          Search Results
          {data && <span className="text-gray-500 ml-2">({data.length})</span>}
        </h2>
      </div>
      <EmailList />
    </div>
  );
};

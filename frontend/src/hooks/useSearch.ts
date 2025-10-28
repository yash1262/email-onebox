import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { searchService } from '../services/searchService';
import { SearchFilters } from '../types/api.types';

export const useSearch = () => {
  const [filters, setFilters] = useState<SearchFilters>({});
  const [isSearching, setIsSearching] = useState(false);

  const query = useQuery({
    queryKey: ['search', filters],
    queryFn: async () => {
      if (!filters.query && !filters.accountEmail && !filters.category) {
        return [];
      }
      setIsSearching(true);
      try {
        return await searchService.advancedSearch(filters);
      } finally {
        setIsSearching(false);
      }
    },
    enabled: false // Manual trigger
  });

  const search = (newFilters: SearchFilters) => {
    setFilters(newFilters);
    query.refetch();
  };

  const clearSearch = () => {
    setFilters({});
  };

  return {
    ...query,
    search,
    clearSearch,
    isSearching,
    filters
  };
};

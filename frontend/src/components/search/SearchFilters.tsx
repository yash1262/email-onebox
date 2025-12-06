import React, { useState } from 'react';
import { Filter } from 'lucide-react';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { useSearch } from '../../hooks/useSearch';
import { Category } from '../../types/email.types';

export const SearchFilters: React.FC = () => {
  const { search, filters } = useSearch();
  const [showFilters, setShowFilters] = useState(false);
  const [localFilters, setLocalFilters] = useState(filters);

  const handleApplyFilters = () => {
    search(localFilters);
    setShowFilters(false);
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setShowFilters(!showFilters)}
      >
        <Filter size={16} className="mr-2" />
        Filters
      </Button>

      {showFilters && (
        <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-50">
          <h3 className="font-semibold text-gray-900 mb-4">Advanced Filters</h3>

          <div className="space-y-3">
            <Input
              label="Account"
              placeholder="Filter by account email"
              value={localFilters.accountEmail || ''}
              onChange={(e) =>
                setLocalFilters({ ...localFilters, accountEmail: e.target.value })
              }
            />

            <Input
              label="Folder"
              placeholder="Filter by folder"
              value={localFilters.folder || ''}
              onChange={(e) =>
                setLocalFilters({ ...localFilters, folder: e.target.value })
              }
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                value={localFilters.category || ''}
                onChange={(e) =>
                  setLocalFilters({ ...localFilters, category: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Categories</option>
                {Object.values(Category).map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <Input
              label="Date From"
              type="date"
              value={localFilters.dateFrom || ''}
              onChange={(e) =>
                setLocalFilters({ ...localFilters, dateFrom: e.target.value })
              }
            />

            <Input
              label="Date To"
              type="date"
              value={localFilters.dateTo || ''}
              onChange={(e) =>
                setLocalFilters({ ...localFilters, dateTo: e.target.value })
              }
            />
          </div>

          <div className="flex gap-2 mt-4">
            <Button onClick={handleApplyFilters} className="flex-1">
              Apply Filters
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                setLocalFilters({});
                setShowFilters(false);
              }}
            >
              Clear
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

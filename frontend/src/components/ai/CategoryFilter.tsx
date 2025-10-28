import React from 'react';
import { Category } from '../../types/email.types';
import { CategoryBadge } from '../email/CategoryBadge';
import { useUiStore } from '../../store/uiStore';

export const CategoryFilter: React.FC = () => {
  const { selectedCategory, setSelectedCategory } = useUiStore();
  const categories = Object.values(Category);

  return (
    <div className="flex flex-wrap gap-2 p-4 bg-white border-b">
      <button
        onClick={() => setSelectedCategory(null)}
        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
          !selectedCategory
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        All
      </button>
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => setSelectedCategory(category)}
          className={`transition-opacity ${
            selectedCategory === category ? 'opacity-100' : 'opacity-60 hover:opacity-100'
          }`}
        >
          <CategoryBadge category={category} size="md" />
        </button>
      ))}
    </div>
  );
};

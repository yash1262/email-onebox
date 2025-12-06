import React from 'react';
import { Category } from '../../types/email.types';
import { CategoryBadge } from '../email/CategoryBadge';
import { useUiStore } from '../../store/uiStore';

export const CategoryFilter: React.FC = () => {
  try {
    const { selectedCategory, setSelectedCategory } = useUiStore();
    const categories = Object.values(Category);

    return (
      <div className="flex flex-wrap items-center gap-2.5 px-5 py-4 bg-white border-b border-gray-200/80 shadow-soft">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
            !selectedCategory
              ? 'bg-primary-600 text-white shadow-medium'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All
        </button>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`transition-all duration-200 ${
              selectedCategory === category 
                ? 'scale-105 shadow-soft' 
                : 'opacity-75 hover:opacity-100 hover:scale-105'
            }`}
          >
            <CategoryBadge category={category} size="md" />
          </button>
        ))}
      </div>
    );
  } catch (error) {
    console.error('CategoryFilter error:', error);
    return (
      <div className="px-5 py-4 bg-white border-b border-gray-200/80">
        <p className="text-sm text-gray-500">Filters unavailable</p>
      </div>
    );
  }
};

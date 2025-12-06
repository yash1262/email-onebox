import React from 'react';
import { Category, CATEGORY_COLORS } from '../../types/email.types';

interface CategoryBadgeProps {
  category: string;
  size?: 'sm' | 'md';
}

export const CategoryBadge: React.FC<CategoryBadgeProps> = ({ 
  category, 
  size = 'sm' 
}) => {
  const colorClass = CATEGORY_COLORS[category as Category] || CATEGORY_COLORS[Category.UNCATEGORIZED];
  
  const sizeClasses = {
    sm: 'text-xs px-2.5 py-1',
    md: 'text-sm px-3.5 py-1.5'
  };

  return (
    <span className={`inline-flex items-center rounded-lg font-semibold ${colorClass} ${sizeClasses[size]} shadow-soft border border-opacity-20`}>
      {category}
    </span>
  );
};

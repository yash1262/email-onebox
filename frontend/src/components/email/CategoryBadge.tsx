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
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1'
  };

  return (
    <span className={`inline-flex items-center rounded-full font-medium ${colorClass} ${sizeClasses[size]}`}>
      {category}
    </span>
  );
};

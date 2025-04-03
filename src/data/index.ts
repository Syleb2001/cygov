import { basicCategories } from './basic';
import { importantCategories } from './important';
import { essentialCategories } from './essential';
import type { Category } from '../types';

// Combine categories based on user's security level
export const getCategoriesForLevel = (level: 'basic' | 'important' | 'essential'): Category[] => {
  switch (level) {
    case 'essential':
      return [
        ...basicCategories,
        ...importantCategories,
        ...essentialCategories
      ];
    case 'important':
      return [
        ...basicCategories,
        ...importantCategories
      ];
    case 'basic':
    default:
      return basicCategories;
  }
};

// Export individual category sets for direct access
export {
  basicCategories,
  importantCategories,
  essentialCategories
};
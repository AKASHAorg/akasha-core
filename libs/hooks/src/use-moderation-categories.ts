import * as React from 'react';
import { ModerationCategory } from '@akashaorg/typings/lib/ui';

export interface useModerationCategoryProps {
  moderationCategories: ModerationCategory[];
  allCategoriesLabel?: string;
  maxSelection?: number; // maximum allowed categories that can be selected
}

type useModerationCategoryReturnType = {
  categories: string[];
  handleCategoryClick: (category?: ModerationCategory) => () => void;
};

/**
 * Hook to handle moderation/report categories
 * @param props - useModerationCategoryProps
 * @returns useModerationCategoryReturnType
 */
export const useModerationCategory = (
  props: useModerationCategoryProps,
): useModerationCategoryReturnType => {
  const {
    moderationCategories,
    allCategoriesLabel,
    maxSelection = moderationCategories.length,
  } = props;

  const [categories, setCategories] = React.useState<string[]>([]);

  const allCategoriesSelected = categories.length === moderationCategories.length;

  const handleCategoryClick = (category?: ModerationCategory) => () => {
    if (category.label === allCategoriesLabel) {
      if (allCategoriesSelected) {
        return setCategories([]);
      }
      return setCategories(moderationCategories.map(el => el.value));
    }

    const found = categories.find(cat => cat === category.value);

    if (!found && categories.length < maxSelection) {
      setCategories([...categories, category.value]);
    } else {
      const updated = categories.filter(cat => cat !== category.value);

      return setCategories(updated);
    }
  };

  return { categories, handleCategoryClick };
};

import React from 'react';

import Box from '@akashaorg/design-system-core/lib/components/Box';
import Pill from '@akashaorg/design-system-core/lib/components/Pill';

export type ModerationCategory = { value: string; label: string };

export interface ICategoryPillsProps {
  selectedCategories: string[];
  moderationCategories: ModerationCategory[];
  allCategoriesLabel?: string;
  maxSelection?: number; // maximum allowed categories that can be selected
}

export const CategoryPills: React.FC<ICategoryPillsProps> = props => {
  const {
    selectedCategories,
    moderationCategories,
    allCategoriesLabel,
    maxSelection = moderationCategories.length,
  } = props;

  const [categories, setCategories] = React.useState<string[]>(selectedCategories ?? []);

  const allCategoriesSelected = categories.length === moderationCategories.length;

  const handlePillClick = (category?: ModerationCategory) => () => {
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

  return (
    <Box customStyle="flex flex-wrap">
      {allCategoriesLabel && (
        <Pill
          label={allCategoriesLabel}
          active={allCategoriesSelected}
          customStyle="mt-3 mr-3"
          onPillClick={handlePillClick({ label: allCategoriesLabel, value: allCategoriesLabel })}
        />
      )}

      {moderationCategories.map(({ label, value }, idx) => (
        <Pill
          key={label + idx}
          label={label}
          active={categories.includes(value)}
          icon={categories.includes(value) ? 'XMarkIcon' : undefined}
          iconDirection="right"
          customStyle="mt-3 mr-3"
          onPillClick={handlePillClick({ label, value })}
        />
      ))}
    </Box>
  );
};

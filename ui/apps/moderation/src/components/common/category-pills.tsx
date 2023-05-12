import React from 'react';

import Box from '@akashaorg/design-system-core/lib/components/Box';
import Pill from '@akashaorg/design-system-core/lib/components/Pill';

export type ModerationCategory = { value: string; label: string };

export interface ICategoryPillsProps {
  selectedCategories: ModerationCategory[];
  moderationCategories: ModerationCategory[];
  allCategoriesLabel: string;
}

export const CategoryPills: React.FC<ICategoryPillsProps> = props => {
  const { selectedCategories, moderationCategories, allCategoriesLabel } = props;

  const [categories, setCategories] = React.useState<ModerationCategory[]>(
    selectedCategories ?? [],
  );

  const allCategoriesSelected = categories.length === moderationCategories.length;

  const handlePillClick = (category?: ModerationCategory) => () => {
    if (category.label === allCategoriesLabel) {
      if (allCategoriesSelected) {
        return setCategories([]);
      }
      return setCategories(moderationCategories);
    }

    const found = categories.find(cat => cat?.value === category.value);

    if (!found) {
      setCategories([...categories, category]);
    } else {
      const updated = categories.filter(cat => cat?.value !== category.value);

      return setCategories(updated);
    }
  };

  return (
    <Box customStyle="flex flex-wrap">
      <Pill
        label={allCategoriesLabel}
        clickable={true}
        active={allCategoriesSelected}
        customStyle="mt-3 mr-3"
        onPillClick={handlePillClick({ label: allCategoriesLabel, value: allCategoriesLabel })}
      />

      {moderationCategories.map(({ label, value }, idx) => (
        <Pill
          key={label + idx}
          label={label}
          clickable={true}
          active={categories.map(cat => cat?.value).includes(value)}
          icon={categories.map(cat => cat?.value).includes(value) ? 'XMarkIcon' : undefined}
          iconDirection="right"
          customStyle="mt-3 mr-3"
          onPillClick={handlePillClick({ label, value })}
        />
      ))}
    </Box>
  );
};

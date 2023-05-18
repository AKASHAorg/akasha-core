import React from 'react';
import { ModerationCategory } from '@akashaorg/typings/ui';

import Box from '@akashaorg/design-system-core/lib/components/Box';
import Pill from '@akashaorg/design-system-core/lib/components/Pill';

export interface ICategoryPillsProps {
  categories: string[];
  moderationCategories: ModerationCategory[];
  allCategoriesLabel?: string;
  allCategoriesSelected?: boolean;
  onPillClick: (category?: ModerationCategory) => () => void;
}

export const CategoryPills: React.FC<ICategoryPillsProps> = props => {
  const {
    categories,
    moderationCategories,
    allCategoriesLabel,
    allCategoriesSelected,
    onPillClick,
  } = props;

  return (
    <Box customStyle="flex flex-wrap">
      {allCategoriesLabel && (
        <Pill
          label={allCategoriesLabel}
          active={allCategoriesSelected}
          customStyle="mt-3 mr-3"
          onPillClick={onPillClick({ label: allCategoriesLabel, value: allCategoriesLabel })}
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
          onPillClick={onPillClick({ label, value })}
        />
      ))}
    </Box>
  );
};

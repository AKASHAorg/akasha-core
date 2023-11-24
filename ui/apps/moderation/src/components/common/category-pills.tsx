import React from 'react';

import { ModerationCategory } from '@akashaorg/typings/lib/ui';

import { XMarkIcon } from '@akashaorg/design-system-core/lib/components/Icon/hero-icons-outline';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Pill from '@akashaorg/design-system-core/lib/components/Pill';

export type CategoryPillsProps = {
  categories: string[];
  moderationCategories: ModerationCategory[];
  allCategoriesLabel?: string;
  allCategoriesSelected?: boolean;
  onPillClick: (category?: ModerationCategory) => () => void;
};

export const CategoryPills: React.FC<CategoryPillsProps> = props => {
  const {
    categories,
    moderationCategories,
    allCategoriesLabel,
    allCategoriesSelected,
    onPillClick,
  } = props;

  return (
    <Stack direction="row" customStyle="flex-wrap">
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
          icon={categories.includes(value) ? <XMarkIcon /> : undefined}
          iconDirection="right"
          customStyle="mt-3 mr-3"
          onPillClick={onPillClick({ label, value })}
        />
      ))}
    </Stack>
  );
};

import React from 'react';

import { ModerationCategory } from '@akashaorg/typings/lib/ui';

import { XIcon } from 'lucide-react';
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
          type="action"
        />
      )}

      {moderationCategories.map(({ label, value }, idx) => (
        <Pill
          key={label + idx}
          label={label}
          active={categories.includes(value)}
          icon={categories.includes(value) ? <XIcon className="h-5 w-5 [&>*]:stroke-secondaryLight dark:[&>*]:stroke-secondaryDark" /> : undefined}
          iconDirection="right"
          customStyle="mt-3 mr-3"
          onPillClick={onPillClick({ label, value })}
          type="action"
        />
      ))}
    </Stack>
  );
};

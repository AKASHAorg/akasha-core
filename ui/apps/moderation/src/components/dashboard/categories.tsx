import React from 'react';

import Box from '@akashaorg/design-system-core/lib/components/Box';
import Pill from '@akashaorg/design-system-core/lib/components/Pill';

import PageHeader, { IPageHeaderProps } from './page-header';

export type ModerationCategory = { value: string; label: string };

export interface IEditCategoriesProps extends IPageHeaderProps {
  label: string;
  selectedCategories: ModerationCategory[];
  moderationCategories: ModerationCategory[];
  allCategoriesLabel: string;
  cancelButtonLabel: string;
  confirmButtonLabel: string;
  onCancelButtonClick: () => void;
  onConfirmButtonClick: () => void;
}

const EditCategories: React.FC<IEditCategoriesProps> = props => {
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
    <PageHeader {...props}>
      <Box customStyle="flex flex-wrap">
        <Pill
          label={allCategoriesLabel}
          clickable={true}
          secondaryBg={allCategoriesSelected}
          customStyle="mt-3 mr-3"
          onPillClick={handlePillClick({ label: allCategoriesLabel, value: allCategoriesLabel })}
        />

        {moderationCategories.map(({ label, value }, idx) => (
          <Pill
            key={label + idx}
            label={label}
            clickable={true}
            secondaryBg={categories.map(cat => cat?.value).includes(value)}
            trailingIcon={
              categories.map(cat => cat?.value).includes(value) ? 'XMarkIcon' : undefined
            }
            customStyle="mt-3 mr-3"
            onPillClick={handlePillClick({ label, value })}
          />
        ))}
      </Box>
    </PageHeader>
  );
};

export default EditCategories;

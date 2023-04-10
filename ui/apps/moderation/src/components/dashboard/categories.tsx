import React from 'react';

import BasicCardBox from '@akashaorg/design-system-core/lib/components/BasicCardBox';
import Box from '@akashaorg/design-system-core/lib/components/Box';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import Pill from '@akashaorg/design-system-core/lib/components/Pill';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import Divider from '@akashaorg/design-system-core/lib/components/Divider';

export type ModerationCategory = { value: string; label: string };

export interface IEditCategoriesProps {
  categoriesLabel: string;
  selectedCategories: ModerationCategory[];
  moderationCategories: ModerationCategory[];
  allCategoriesLabel: string;
  cancelButtonLabel: string;
  confirmButtonLabel: string;
  onCancelButtonClick: () => void;
  onConfirmButtonClick: () => void;
}

const EditCategories: React.FC<IEditCategoriesProps> = props => {
  const {
    categoriesLabel,
    selectedCategories,
    moderationCategories,
    allCategoriesLabel,
    cancelButtonLabel,
    confirmButtonLabel,
    onCancelButtonClick,
    onConfirmButtonClick,
  } = props;

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
    <BasicCardBox pad="p-0">
      <Box customStyle="px-4 py-6">
        <Text variant="h5" align="center">
          {categoriesLabel}
        </Text>
      </Box>

      <Divider />

      <Box customStyle="flex flex-wrap p-4">
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

      <Box customStyle="flex space-x-6 items-center justify-end p-4 my-2">
        <Button plain={true} onClick={onCancelButtonClick}>
          <Text weight="bold" color={{ light: 'secondaryLight', dark: 'secondaryDark' }}>
            {cancelButtonLabel}
          </Text>
        </Button>

        <Button
          size="md"
          variant="primary"
          label={confirmButtonLabel}
          onClick={onConfirmButtonClick}
        />
      </Box>
    </BasicCardBox>
  );
};

export default EditCategories;

import React from 'react';

import BasicCardBox from '@akashaorg/design-system-core/lib/components/BasicCardBox';
import Box from '@akashaorg/design-system-core/lib/components/Box';
import Text from '@akashaorg/design-system-core/lib/components/Text';

import CategoryPills from '../../dashboard/category-pills';
import PageButtons, { IPageButtonsProps } from '../../dashboard/page-buttons';
import { ModerationCategory } from '../../dashboard/categories';

export interface IBMSelectCategoryProps extends IPageButtonsProps {
  titleLabel: string;
  subtitleLabel: string;
  selectedCategories: ModerationCategory[];
  moderationCategories: ModerationCategory[];
  allCategoriesLabel: string;
}

const BMSelectCategory: React.FC<IBMSelectCategoryProps> = props => {
  const { titleLabel, subtitleLabel } = props;

  return (
    <BasicCardBox pad="p-4">
      <Box customStyle="flex flex-col space-y-4">
        <Text variant="h5" align="center">
          {titleLabel}
        </Text>

        <Text variant="footnotes2" weight="light">
          {subtitleLabel}{' '}
        </Text>

        <CategoryPills {...props} />

        <Box customStyle="flex space-x-6 items-center justify-end">
          <PageButtons {...props} />
        </Box>
      </Box>
    </BasicCardBox>
  );
};

export default BMSelectCategory;

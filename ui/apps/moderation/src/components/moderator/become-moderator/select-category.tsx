import React from 'react';

import Text from '@akashaorg/design-system-core/lib/components/Text';

import {
  CategoryPills,
  CategoryPillsProps,
  SteppedActionWrapperProps,
  SteppedActionWrapper,
} from '../../common';

export type BMSelectCategoryProps = SteppedActionWrapperProps &
  CategoryPillsProps & {
    titleLabel: string;
    subtitleLabel: string;
  };

const BMSelectCategory: React.FC<BMSelectCategoryProps> = props => {
  const { subtitleLabel } = props;

  return (
    <SteppedActionWrapper {...props}>
      <Text variant="footnotes2" weight="light">
        {subtitleLabel}{' '}
      </Text>

      <CategoryPills {...props} />
    </SteppedActionWrapper>
  );
};

export default BMSelectCategory;

import React from 'react';

import Text from '@akashaorg/design-system-core/lib/components/Text';

import CategoryPills, { ICategoryPillsProps } from '../../dashboard/category-pills';
import SteppedActionWrapper, { ISteppedActionWrapperProps } from './stepped-action-wrapper';

export interface IBMSelectCategoryProps extends ISteppedActionWrapperProps {
  titleLabel: string;
  subtitleLabel: string;
}

const BMSelectCategory: React.FC<IBMSelectCategoryProps & ICategoryPillsProps> = props => {
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

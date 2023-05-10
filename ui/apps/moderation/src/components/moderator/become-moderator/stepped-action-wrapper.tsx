import React, { PropsWithChildren } from 'react';

import BasicCardBox from '@akashaorg/design-system-core/lib/components/BasicCardBox';
import Box from '@akashaorg/design-system-core/lib/components/Box';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import StepIndicator from '@akashaorg/design-system-core/lib/components/Stepper';

import PageButtons, { IPageButtonsProps } from '../../dashboard/page-buttons';

export interface ISteppedActionWrapperProps extends IPageButtonsProps {
  stepLabels: string[];
  activeIndex: number;
  titleLabel: string;
}

const SteppedActionWrapper: React.FC<PropsWithChildren<ISteppedActionWrapperProps>> = props => {
  const { stepLabels, activeIndex, titleLabel, children } = props;

  return (
    <BasicCardBox pad="p-4">
      <Box customStyle="flex flex-col space-y-4">
        <Box customStyle="self-center">
          <StepIndicator stepLabels={stepLabels} activeIndex={activeIndex} />
        </Box>

        <Text variant="h5" align="center">
          {titleLabel}
        </Text>

        {children}

        <Box customStyle="flex space-x-6 items-center justify-end">
          <PageButtons {...props} />
        </Box>
      </Box>
    </BasicCardBox>
  );
};

export default SteppedActionWrapper;

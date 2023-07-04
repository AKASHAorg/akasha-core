import React, { PropsWithChildren } from 'react';

import Anchor from '@akashaorg/design-system-core/lib/components/Anchor';
import BasicCardBox from '@akashaorg/design-system-core/lib/components/BasicCardBox';
import Box from '@akashaorg/design-system-core/lib/components/Box';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import StepIndicator from '@akashaorg/design-system-core/lib/components/Stepper';

import { PageButtons, PageButtonsProps } from '../PageButtons';

export type SteppedActionWrapperProps = PageButtonsProps & {
  stepLabels: string[];
  activeIndex: number;
  titleLabel: string;
  footerCTALabel?: string;
  footerCTAUrl?: string;
};

export const SteppedActionWrapper: React.FC<
  PropsWithChildren<SteppedActionWrapperProps>
> = props => {
  const { stepLabels, activeIndex, titleLabel, footerCTALabel, footerCTAUrl, children } = props;

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

        <Box customStyle="flex items-center justify-between">
          <Anchor href={footerCTAUrl} customStyle="text-sm text-center font-bold">
            {footerCTALabel}
          </Anchor>

          <Box customStyle="flex space-x-6 items-center">
            <PageButtons {...props} />
          </Box>
        </Box>
      </Box>
    </BasicCardBox>
  );
};

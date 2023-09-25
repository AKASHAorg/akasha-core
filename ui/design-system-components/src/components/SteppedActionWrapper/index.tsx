import React, { PropsWithChildren } from 'react';

import Anchor from '@akashaorg/design-system-core/lib/components/Anchor';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
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
    <Card padding={16}>
      <Stack spacing="gap-y-4">
        <Stack customStyle="self-center">
          <StepIndicator stepLabels={stepLabels} activeIndex={activeIndex} />
        </Stack>

        <Text variant="h5" align="center">
          {titleLabel}
        </Text>

        {children}

        <Stack direction="row" align="center" justify="between">
          <Anchor href={footerCTAUrl} customStyle="text-sm text-center font-bold">
            {footerCTALabel}
          </Anchor>

          <PageButtons {...props} />
        </Stack>
      </Stack>
    </Card>
  );
};

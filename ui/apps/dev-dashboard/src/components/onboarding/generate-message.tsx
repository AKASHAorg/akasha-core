import React from 'react';

import Button from '@akashaorg/design-system-core/lib/components/Button';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import {
  SteppedActionWrapper,
  SteppedActionWrapperProps,
} from '@akashaorg/design-system-components/lib/components/SteppedActionWrapper';

import { DevMessageForm, DevMessageFormProps } from '../common';

export type GenerateMessageProps = DevMessageFormProps &
  SteppedActionWrapperProps & {
    ctaIntroLabel: string[];
    onCTAClick: () => void;
  };

export const GenerateMessage: React.FC<GenerateMessageProps> = props => {
  const { ctaIntroLabel, onCTAClick } = props;

  return (
    <SteppedActionWrapper {...props}>
      <Text>
        {ctaIntroLabel[0]}{' '}
        <Button plain={true} onClick={onCTAClick}>
          <Text color={{ light: 'secondaryLight', dark: 'secondaryDark' }} weight="bold">
            {ctaIntroLabel[1]}
          </Text>
        </Button>{' '}
        {ctaIntroLabel[2]}
      </Text>

      <DevMessageForm {...props} />
    </SteppedActionWrapper>
  );
};

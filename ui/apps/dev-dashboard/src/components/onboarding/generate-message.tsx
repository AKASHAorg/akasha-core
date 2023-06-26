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
    ctaIntroLabel?: string[];
    onCTAClick?: () => void;
  };

export const GenerateMessage: React.FC<GenerateMessageProps> = props => {
  const { ctaIntroLabel, onCTAClick } = props;

  const handleCTAClick = () => {
    if (onCTAClick && typeof onCTAClick === 'function') onCTAClick();
  };

  return (
    <SteppedActionWrapper {...props}>
      {ctaIntroLabel && ctaIntroLabel.length && (
        <Text>
          {ctaIntroLabel[0]}{' '}
          <Button plain={true} onClick={handleCTAClick}>
            <Text color={{ light: 'secondaryLight', dark: 'secondaryDark' }} weight="bold">
              {ctaIntroLabel[1]}
            </Text>
          </Button>{' '}
          {ctaIntroLabel[2]}
        </Text>
      )}

      <DevMessageForm {...props} />
    </SteppedActionWrapper>
  );
};

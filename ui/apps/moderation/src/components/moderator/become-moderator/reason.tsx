import React from 'react';

import Text from '@akashaorg/design-system-core/lib/components/Text';
import TextField from '@akashaorg/design-system-core/lib/components/TextField';

import { SteppedActionWrapperProps, SteppedActionWrapper } from '../../common';

export type BMSelectReasonProps = SteppedActionWrapperProps & {
  titleLabel: string;
  subtitleLabel: string;
  reasonCaption: string;
  reasonPlaceholderLabel: string;
};

const BMSelectReason: React.FC<BMSelectReasonProps> = props => {
  const { subtitleLabel, reasonCaption, reasonPlaceholderLabel } = props;

  return (
    <SteppedActionWrapper {...props}>
      <Text variant="footnotes2" weight="light">
        {subtitleLabel}
      </Text>

      <TextField caption={reasonCaption} placeholder={reasonPlaceholderLabel} type="multiline" />
    </SteppedActionWrapper>
  );
};

export default BMSelectReason;

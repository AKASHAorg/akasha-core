import React from 'react';

import Box from '@akashaorg/design-system-core/lib/components/Box';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import {
  SteppedActionWrapperProps,
  SteppedActionWrapper,
} from '@akashaorg/design-system-components/lib/components/SteppedActionWrapper';

import { ListItem } from './list-item';

export type BaseStepsProps = {
  introLabel?: string;
  subtitleLabel?: string;
};

export type TermsAndConditionsProps = BaseStepsProps &
  SteppedActionWrapperProps & {
    paragraphs: string[];
  };

export const TermsAndConditions: React.FC<TermsAndConditionsProps> = props => {
  const { introLabel, subtitleLabel, paragraphs } = props;

  return (
    <SteppedActionWrapper {...props}>
      <Box>
        {introLabel && (
          <Text customStyle="mb-2" weight="bold">
            {introLabel}
          </Text>
        )}

        {subtitleLabel && <Text customStyle="mb-2">{subtitleLabel}</Text>}

        <Box customStyle="space-y-4">
          {paragraphs.map((paragraph: string, idx: number) => (
            <ListItem key={idx} listElementText="•" item={paragraph} />
          ))}
        </Box>
      </Box>
    </SteppedActionWrapper>
  );
};

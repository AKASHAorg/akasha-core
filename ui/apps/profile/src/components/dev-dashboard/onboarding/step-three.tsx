import React from 'react';

import DS from '@akashaorg/design-system';

import DevMessageForm, { IDevMessageFormProps } from '../profile/dev-message-form';

const { Box, Text } = DS;

interface IStepThreeProps extends IDevMessageFormProps {
  ctaIntroLabel: string[];
  onCTAClick: () => void;
}

const StepThree: React.FC<IStepThreeProps> = props => {
  const { ctaIntroLabel, onCTAClick } = props;

  return (
    <Box gap="xsmall">
      <Text size="large" margin={{ top: 'xsmall' }}>
        {ctaIntroLabel[0]}{' '}
        <Text size="large" color="accentText" style={{ cursor: 'pointer' }} onClick={onCTAClick}>
          {ctaIntroLabel[1]}{' '}
        </Text>
        {ctaIntroLabel[2]}
      </Text>

      <DevMessageForm {...props} />
    </Box>
  );
};

export default StepThree;

import React from 'react';

import DS from '@akashaorg/design-system';
import { IDevKeyCardProps } from '@akashaorg/design-system/lib/components/DevKeyCard';

import { BaseStepsProps } from './step-one';
import { IHeroImageCard } from '../profile/hero-image-card';

const { Box, Button, DevKeyCard } = DS;

type ExtendableProps = BaseStepsProps & IDevKeyCardProps & IHeroImageCard;

interface IStepFourProps extends ExtendableProps {
  buttonLabel: string[];
  onButtonClick: () => void;
}

const StepFour: React.FC<IStepFourProps> = props => {
  const { buttonLabel, onButtonClick } = props;

  return (
    <Box gap="small">
      <Box
        round="0.5rem"
        pad={{ vertical: 'xxsmall', horizontal: 'xsmall' }}
        border={{ color: 'border' }}
      >
        <DevKeyCard {...props} />
      </Box>

      <Box direction="row" justify="end">
        <Button primary={true} label={buttonLabel} onClick={onButtonClick} />
      </Box>
    </Box>
  );
};

export default StepFour;

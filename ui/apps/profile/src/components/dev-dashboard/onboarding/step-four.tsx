import React from 'react';

import DS from '@akashaorg/design-system';
import { useGetDevKeys } from '@akashaorg/ui-awf-hooks';
import { IDevKeyCardProps } from '@akashaorg/design-system/lib/components/DevKeyCard';

import { BaseStepsProps } from './step-one';
import HeroImageCard, { IHeroImageCard } from '../profile/hero-image-card';

const { Box, Button, DevKeyCard } = DS;

type ExtendableProps = BaseStepsProps & IDevKeyCardProps & IHeroImageCard;

interface IStepFourProps extends ExtendableProps {
  buttonLabel: string[];
  onButtonClick: () => void;
}

const StepFour: React.FC<IStepFourProps> = props => {
  const { buttonLabel, onButtonClick } = props;

  const getKeysQuery = useGetDevKeys(true);

  const devKeys = getKeysQuery.data || [];

  return (
    <Box gap="small">
      <HeroImageCard {...props} assetName="key" wrapperBoxMargin={{ vertical: 'medium' }} />

      <Box
        round="0.5rem"
        pad={{ vertical: 'xxsmall', horizontal: 'xsmall' }}
        border={{ color: 'border' }}
      >
        <DevKeyCard {...props} item={devKeys[0]} />
      </Box>

      <Box direction="row" justify="end">
        <Button primary={true} label={buttonLabel} onClick={onButtonClick} />
      </Box>
    </Box>
  );
};

export default StepFour;

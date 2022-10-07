import React from 'react';

import DS from '@akashaorg/design-system';
import { IDevKeyCardProps } from '@akashaorg/design-system/lib/components/DevKeyCard';

import { BaseStepsProps } from './step-one';

const { Box, Button, DevKeyCard, Text, Image } = DS;

type ExtendableProps = BaseStepsProps & IDevKeyCardProps;

interface IStepFourProps extends ExtendableProps {
  assetName?: string;
  publicImgPath?: string;
  paragraphLabel: string;
  buttonLabel: string[];
  onButtonClick: () => void;
}

const StepFour: React.FC<IStepFourProps> = props => {
  const {
    assetName = 'key',
    publicImgPath = '/images',
    titleLabel,
    paragraphLabel,
    buttonLabel,
    onButtonClick,
  } = props;

  return (
    <Box gap="small">
      <Box height="13rem" width="16rem" margin={{ vertical: 'medium' }} alignSelf="center">
        <Image fit="contain" src={`${publicImgPath}/${assetName}.png`} />
      </Box>
      {titleLabel && (
        <Text size="large" weight="bold" textAlign="center">
          {titleLabel}
        </Text>
      )}
      <Text size="large" textAlign="center">
        {paragraphLabel}
      </Text>
      <Box
        round="0.5rem"
        pad={{ vertical: 'xxsmall', horizontal: 'xsmall' }}
        border={{ color: 'border' }}
      >
        <DevKeyCard {...props} />
      </Box>

      <Box direction="row" justify="end" gap="small">
        <Button primary={true} label={buttonLabel} onClick={onButtonClick} />
      </Box>
    </Box>
  );
};

export default StepFour;

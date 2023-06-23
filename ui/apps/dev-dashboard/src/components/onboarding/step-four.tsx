import React from 'react';
import { tw } from '@twind/core';

import Box from '@akashaorg/design-system-core/lib/components/Box';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import {
  DevKeyCard,
  DevKeyCardProps,
} from '@akashaorg/design-system-components/lib/components/DevKeyCard';
import {
  SteppedActionWrapper,
  SteppedActionWrapperProps,
} from '@akashaorg/design-system-components/lib/components/SteppedActionWrapper';

import { BaseStepsProps } from './step-one';
import { sampleDevKeys } from '../../utils/dummy-data';

type ExtendableProps = BaseStepsProps & SteppedActionWrapperProps & DevKeyCardProps;

export type StepFourProps = ExtendableProps & {
  assetName?: string;
  assetExtension?: string;
  publicImgPath?: string;
};

const StepFour: React.FC<StepFourProps> = props => {
  const {
    subtitleLabel,
    assetName = 'ok',
    assetExtension = 'webp',
    publicImgPath = '/images',
  } = props;

  return (
    <SteppedActionWrapper {...props}>
      <Box customStyle="flex flex-col w-full">
        <Text>{subtitleLabel}</Text>

        <Box customStyle="w-[17.5rem] h-[17.5rem] my-6 self-center">
          <img
            alt={assetName}
            className={tw('object-contain')}
            src={`${publicImgPath}/${assetName}.${assetExtension}`}
          />
        </Box>

        <DevKeyCard {...props} item={sampleDevKeys[0]} />
      </Box>
    </SteppedActionWrapper>
  );
};

export default StepFour;

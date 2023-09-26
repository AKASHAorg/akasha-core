import React from 'react';

import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Image from '@akashaorg/design-system-core/lib/components/Image';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import DevKeyCard, {
  DevKeyCardProps,
} from '@akashaorg/design-system-components/lib/components/DevKeyCard';
import {
  SteppedActionWrapper,
  SteppedActionWrapperProps,
} from '@akashaorg/design-system-components/lib/components/SteppedActionWrapper';

import { BaseStepsProps } from './terms-and-conditions';
import { sampleDevKeys } from '../../utils/dummy-data';

type ExtendableProps = BaseStepsProps & SteppedActionWrapperProps & DevKeyCardProps;

export type KeyConfirmationProps = ExtendableProps & {
  assetName?: string;
  assetExtension?: string;
  publicImgPath?: string;
};

export const KeyConfirmation: React.FC<KeyConfirmationProps> = props => {
  const {
    subtitleLabel,
    assetName = 'ok',
    assetExtension = 'webp',
    publicImgPath = '/images',
  } = props;

  return (
    <SteppedActionWrapper {...props}>
      <Stack fullWidth={true}>
        <Text>{subtitleLabel}</Text>

        <Stack customStyle="w-[17.5rem] h-[17.5rem] my-6 self-center">
          <Image src={`${publicImgPath}/${assetName}.${assetExtension}`} />
        </Stack>

        <DevKeyCard {...props} item={sampleDevKeys[0]} />
      </Stack>
    </SteppedActionWrapper>
  );
};

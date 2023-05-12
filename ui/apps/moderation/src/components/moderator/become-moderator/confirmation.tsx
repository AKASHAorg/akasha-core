import React from 'react';
import { tw } from '@twind/core';

import Box from '@akashaorg/design-system-core/lib/components/Box';
import {
  ISteppedActionWrapperProps,
  ISubtitleRendererProps,
  SteppedActionWrapper,
  SubtitleRenderer,
} from '../../common';

export interface IBMConfirmationProps extends ISteppedActionWrapperProps {
  assetName?: string;
  publicImgPath?: string;
  titleLabel: string;
}

const BMConfirmation: React.FC<IBMConfirmationProps & ISubtitleRendererProps> = props => {
  const { assetName = 'moderation', publicImgPath = '/images' } = props;

  return (
    <SteppedActionWrapper {...props}>
      <Box customStyle="w-40 h-40 my-2 mx-auto">
        <img
          className={tw('object-contain')}
          aria-label={assetName}
          src={`${publicImgPath}/${assetName}.webp`}
          alt={assetName}
          data-testid={`${assetName}-image`}
        />
      </Box>

      <SubtitleRenderer {...props} />
    </SteppedActionWrapper>
  );
};

export default BMConfirmation;

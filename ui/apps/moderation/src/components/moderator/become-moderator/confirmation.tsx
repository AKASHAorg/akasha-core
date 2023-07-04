import React from 'react';

import Box from '@akashaorg/design-system-core/lib/components/Box';
import Image from '@akashaorg/design-system-core/lib/components/Image';
import {
  SteppedActionWrapperProps,
  SteppedActionWrapper,
} from '@akashaorg/design-system-components/lib/components/SteppedActionWrapper';

import { SubtitleRendererProps, SubtitleRenderer } from '../../common';

export type BMConfirmationProps = SteppedActionWrapperProps &
  SubtitleRendererProps & {
    assetName?: string;
    publicImgPath?: string;
    assetExtension?: string;
    titleLabel: string;
  };

const BMConfirmation: React.FC<BMConfirmationProps> = props => {
  const { assetName = 'moderation', assetExtension = 'webp', publicImgPath = '/images' } = props;

  return (
    <SteppedActionWrapper {...props}>
      <Box customStyle="w-40 h-40 my-2 mx-auto">
        <Image
          src={`${publicImgPath}/${assetName}.${assetExtension}`}
          dataTestId={`${assetName}-image`}
        />
      </Box>

      <SubtitleRenderer {...props} />
    </SteppedActionWrapper>
  );
};

export default BMConfirmation;

import React from 'react';

import Stack from '@akashaorg/design-system-core/lib/components/Stack';
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
  const { assetName = 'vibe-received', assetExtension = 'webp', publicImgPath = '/images' } = props;

  return (
    <SteppedActionWrapper {...props}>
      <Stack customStyle="w-40 h-40 my-2 mx-auto">
        <Image
          src={`${publicImgPath}/${assetName}.${assetExtension}`}
          dataTestId={`${assetName}-image`}
        />
      </Stack>

      <SubtitleRenderer {...props} />
    </SteppedActionWrapper>
  );
};

export default BMConfirmation;

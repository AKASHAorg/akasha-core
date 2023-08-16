import React from 'react';

import Card from '@akashaorg/design-system-core/lib/components/Card';
import Box from '@akashaorg/design-system-core/lib/components/Box';
import Image from '@akashaorg/design-system-core/lib/components/Image';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import {
  PageButtonsProps,
  PageButtons,
} from '@akashaorg/design-system-components/lib/components/PageButtons';

import { SubtitleRendererProps, SubtitleRenderer } from '../../common';

export type BMIntroProps = PageButtonsProps &
  SubtitleRendererProps & {
    assetName?: string;
    publicImgPath?: string;
    assetExtension?: string;
    titleLabel: string;
  };

const BMIntro: React.FC<BMIntroProps> = props => {
  const {
    assetName = 'moderation',
    assetExtension = 'webp',
    publicImgPath = '/images',
    titleLabel,
  } = props;

  return (
    <Card padding="p-4">
      <Box customStyle="flex flex-col space-y-4">
        <Text variant="h5" align="center">
          {titleLabel}
        </Text>

        <Box customStyle="w-40 h-40 my-2 mx-auto">
          <Image
            src={`${publicImgPath}/${assetName}.${assetExtension}`}
            dataTestId={`${assetName}-image`}
          />
        </Box>

        <SubtitleRenderer {...props} />

        <Box customStyle="flex space-x-6 items-center justify-end">
          <PageButtons {...props} />
        </Box>
      </Box>
    </Card>
  );
};

export default BMIntro;

import React from 'react';
import { tw } from '@twind/core';

import BasicCardBox from '@akashaorg/design-system-core/lib/components/BasicCardBox';
import Box from '@akashaorg/design-system-core/lib/components/Box';
import Text from '@akashaorg/design-system-core/lib/components/Text';

import {
  PageButtonsProps,
  SubtitleRendererProps,
  PageButtons,
  SubtitleRenderer,
} from '../../common';

export type BMIntroProps = PageButtonsProps &
  SubtitleRendererProps & {
    assetName?: string;
    publicImgPath?: string;
    titleLabel: string;
  };

const BMIntro: React.FC<BMIntroProps> = props => {
  const { assetName = 'moderation', publicImgPath = '/images', titleLabel } = props;

  return (
    <BasicCardBox pad="p-4">
      <Box customStyle="flex flex-col space-y-4">
        <Text variant="h5" align="center">
          {titleLabel}
        </Text>

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

        <Box customStyle="flex space-x-6 items-center justify-end">
          <PageButtons {...props} />
        </Box>
      </Box>
    </BasicCardBox>
  );
};

export default BMIntro;

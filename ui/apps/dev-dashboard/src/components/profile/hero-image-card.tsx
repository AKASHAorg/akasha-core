import React from 'react';
import { tw } from '@twind/core';

import Box from '@akashaorg/design-system-core/lib/components/Box';
import Text from '@akashaorg/design-system-core/lib/components/Text';

export type HeroImageProps = {
  assetName?: string;
  assetExtension?: string;
  publicImgPath?: string;
  titleLabel: string;
  subtitleLabel: string;
};

export const HeroImage: React.FC<HeroImageProps> = props => {
  const {
    assetName = 'ok',
    assetExtension = 'webp',
    publicImgPath = '/images',
    titleLabel,
    subtitleLabel,
  } = props;

  return (
    <Box customStyle="flex flex-col items-center space-y-4">
      <Box customStyle="w-[16rem] h-[13rem]">
        <img
          alt={`${assetName}`}
          className={tw('object-contain')}
          src={`${publicImgPath}/${assetName}.${assetExtension}`}
        />
      </Box>

      {titleLabel && (
        <Text variant="h5" weight="bold" align="center">
          {titleLabel}
        </Text>
      )}

      {subtitleLabel && (
        <Text variant="footnotes2" color={{ light: 'grey4', dark: 'grey6' }} align="center">
          {subtitleLabel}
        </Text>
      )}
    </Box>
  );
};

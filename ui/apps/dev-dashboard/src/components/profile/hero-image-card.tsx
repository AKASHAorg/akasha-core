import React from 'react';

import Box from '@akashaorg/design-system-core/lib/components/Box';
import Image from '@akashaorg/design-system-core/lib/components/Image';
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
        <Image
          assetName={assetName}
          assetExtension={assetExtension}
          publicImgPath={publicImgPath}
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

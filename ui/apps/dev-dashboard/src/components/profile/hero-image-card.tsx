import React from 'react';

import Stack from '@akashaorg/design-system-core/lib/components/Stack';
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
    <Stack align="center" spacing="gap-y-4">
      <Stack customStyle="w-[16rem] h-[13rem]">
        <Image src={`${publicImgPath}/${assetName}.${assetExtension}`} />
      </Stack>

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
    </Stack>
  );
};

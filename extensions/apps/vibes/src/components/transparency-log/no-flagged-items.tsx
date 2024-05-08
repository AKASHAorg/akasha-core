import React from 'react';

import Image from '@akashaorg/design-system-core/lib/components/Image';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';

export type NoFlaggedItemsProps = {
  assetName?: string;
  publicImgPath?: string;
  assetExtension?: string;
  noflaggedItemsLabel: string;
};

const NoFlaggedItems: React.FC<NoFlaggedItemsProps> = props => {
  const {
    assetName = 'vibe-noflags',
    publicImgPath = '/images',
    assetExtension = 'webp',
    noflaggedItemsLabel,
  } = props;

  return (
    <Stack>
      <Stack customStyle="w-40 h-40 my-2 mx-auto">
        <Image
          src={`${publicImgPath}/${assetName}.${assetExtension}`}
          dataTestId={`${assetName}-image`}
        />
      </Stack>

      <Text variant="h6" align="center">
        {noflaggedItemsLabel}
      </Text>
    </Stack>
  );
};

export default NoFlaggedItems;

import React from 'react';
import { BlockInstanceMethods, ContentBlockRootProps } from '@akashaorg/typings/lib/ui';
import ImageGallery from '@akashaorg/design-system-components/lib/components/ImageGallery';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';

export const ImageReadonlyBlock = (
  props: ContentBlockRootProps & { blockRef?: React.RefObject<BlockInstanceMethods> },
) => {
  const content = JSON.parse(props.content.value);
  return (
    <Stack align={content.align || 'start'} spacing="gap-1">
      <ImageGallery images={content.images} />
      {content.caption && <Text>{content.caption}</Text>}
    </Stack>
  );
};

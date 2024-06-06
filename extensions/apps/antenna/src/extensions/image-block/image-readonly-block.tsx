import React from 'react';
import { BlockInstanceMethods, ContentBlockRootProps } from '@akashaorg/typings/lib/ui';
import ImageBlockGallery from '@akashaorg/design-system-components/lib/components/ImageBlockGallery';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import { transformSource } from '@akashaorg/ui-awf-hooks';

export const ImageReadonlyBlock = (
  props: ContentBlockRootProps & { blockRef?: React.RefObject<BlockInstanceMethods> },
) => {
  const content = JSON.parse(props.content.value);
  const transformedImages = content?.images?.map(imageObj => {
    return transformSource(imageObj);
  });
  return (
    <Stack align={content.align || 'start'} spacing="gap-1">
      <ImageBlockGallery images={transformedImages} />
      {content.caption && <Text breakWord>{content.caption}</Text>}
    </Stack>
  );
};

import React from 'react';
import { BlockInstanceMethods, ContentBlockRootProps } from '@akashaorg/typings/lib/ui';
import ReadOnlyEditor from '@akashaorg/design-system-components/lib/components/ReadOnlyEditor';
import { decodeb64SlateContent } from '@akashaorg/ui-awf-hooks';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';

export const SlateReadonlyBlock = (
  props: ContentBlockRootProps & { blockRef?: React.RefObject<BlockInstanceMethods> },
) => {
  const content = decodeb64SlateContent(props.content.value, props.logger);
  return (
    <Stack>
      <ReadOnlyEditor content={content} />
    </Stack>
  );
};

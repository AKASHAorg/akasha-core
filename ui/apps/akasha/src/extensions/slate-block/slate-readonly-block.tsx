import React from 'react';
import { BlockInstanceMethods, ContentBlockRootProps } from '@akashaorg/typings/lib/ui';
import ReadOnlyEditor from '@akashaorg/design-system-components/lib/components/ReadOnlyEditor';
import { decodeb64SlateContent } from '@akashaorg/ui-awf-hooks';

export const SlateReadonlyBlock = (
  props: ContentBlockRootProps & { blockRef?: React.RefObject<BlockInstanceMethods> },
) => {
  const content = decodeb64SlateContent(props.content.value);
  return (
    <div>
      <ReadOnlyEditor content={content} />
    </div>
  );
};

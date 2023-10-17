import React from 'react';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import CircularPlaceholder from '@akashaorg/design-system-core/lib/components/CircularPlaceholder';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import TextLine from '@akashaorg/design-system-core/lib/components/TextLine';

const EditorPlaceholderLoading = () => {
  return (
    <Card border={true} padding={0}>
      <Stack direction="row" justify="between" align="center" customStyle="px-4 py-2">
        <CircularPlaceholder height="h-8" width="w-8" customStyle="shrink-0" animated={true} />
        <TextLine width="w-8" />
      </Stack>
    </Card>
  );
};

export default EditorPlaceholderLoading;

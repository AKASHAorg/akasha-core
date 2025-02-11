import React from 'react';
import { Card } from '@akashaorg/ui/lib/components/card';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import TextLine from '@akashaorg/design-system-core/lib/components/TextLine';

const EditorPlaceholderLoading = () => {
  return (
    <Card className="p-0">
      <Stack direction="row" justify="between" align="center" customStyle="px-4 py-2">
        <TextLine
          round="rounded-full"
          height="h-8"
          width="w-8"
          customStyle="shrink-0"
          animated={true}
        />
        <TextLine width="w-8" />
      </Stack>
    </Card>
  );
};

export default EditorPlaceholderLoading;

import React from 'react';
import { Card } from '@akashaorg/ui/lib/akasha-components/card';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import TextLine from '@akashaorg/design-system-core/lib/components/TextLine';

const EditorPlaceholderLoading = () => {
  return (
    <Card className="p-0">
      <Stack direction="row" justifyContent="between" alignItems="center" className="px-4 py-2">
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

import React from 'react';
import { Card } from '@akashaorg/ui/lib/akasha-components/card';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import { Skeleton } from '@akashaorg/ui/lib/components/skeleton';

const EditorPlaceholderLoading = () => {
  return (
    <Card className="p-0">
      <Stack direction="row" justifyContent="between" alignItems="center" className="px-4 py-2">
        <Skeleton className="rounded-full h-8 w-8 shrink-0" />
        <Skeleton className="w-8" />
      </Stack>
    </Card>
  );
};

export default EditorPlaceholderLoading;

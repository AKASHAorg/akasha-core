import React from 'react';
import { EditorPlaceholderLoading, EntryCardLoading } from '@akashaorg/ui-lib-feed';
import { Separator } from '@akashaorg/ui/lib/components/separator';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import { Card } from '@akashaorg/ui/lib/akasha-components/card';
const EntrySectionLoading: React.FC<unknown> = () => {
  return (
    <Card className="p-0">
      <Stack spacing={2} className="pb-2">
        <EntryCardLoading noWrapperCard={true} />
        <Separator />
        <Stack className="px-2">
          <EditorPlaceholderLoading />
        </Stack>
      </Stack>
    </Card>
  );
};

export default EntrySectionLoading;

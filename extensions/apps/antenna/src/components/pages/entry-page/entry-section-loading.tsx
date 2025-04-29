import React from 'react';
import { EditorPlaceholderLoading, EntryCardLoading } from '@akashaorg/ui-lib-feed';
import Divider from '@akashaorg/design-system-core/lib/components/Divider';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import { Card } from '@akashaorg/ui/lib/akasha-components/card';
const EntrySectionLoading: React.FC<unknown> = () => {
  return (
    <Card className="p-0">
      <Stack spacing={2} className="pb-2">
        <EntryCardLoading noWrapperCard={true} />
        <Divider />
        <Stack className="px-2">
          <EditorPlaceholderLoading />
        </Stack>
      </Stack>
    </Card>
  );
};

export default EntrySectionLoading;

import React from 'react';
import EntryCardLoading from '@akashaorg/design-system-components/lib/components/Entry/EntryCardLoading';
import EditorPlaceholderLoading from '@akashaorg/design-system-components/lib/components/EditorPlaceholder/EditorPlaceholderLoading';
import Divider from '@akashaorg/design-system-core/lib/components/Divider';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Card from '@akashaorg/design-system-core/lib/components/Card';

const EntrySectionLoading: React.FC<unknown> = () => {
  return (
    <Card padding="p-0">
      <Stack spacing="gap-y-2" customStyle="pb-2">
        <EntryCardLoading noWrapperCard={true} />
        <Divider />
        <Stack padding="px-2">
          <EditorPlaceholderLoading />
        </Stack>
      </Stack>
    </Card>
  );
};

export default EntrySectionLoading;

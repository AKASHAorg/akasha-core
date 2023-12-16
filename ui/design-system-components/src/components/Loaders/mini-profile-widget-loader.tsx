import React from 'react';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import CircularPlaceholder from '@akashaorg/design-system-core/lib/components/CircularPlaceholder';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import TextLine from '@akashaorg/design-system-core/lib/components/TextLine';

const MiniProfileWidgetLoader: React.FC = () => {
  return (
    <Card radius="rounded-2xl" margin="mb-4" padding="p-0" customStyle="max-h-[30rem]">
      <Stack align="center" customStyle="h-28 rounded-t-2xl" fullWidth>
        <Stack customStyle="relative top-12">
          <CircularPlaceholder height="h-20" width="w-20" customStyle="shrink-0" animated />
        </Stack>
      </Stack>

      <Stack spacing="gap-y-4" align="center" padding="p-4 pt-6" fullWidth>
        <Stack spacing="gap-y-1" padding="pt-3" align="center" fullWidth>
          <TextLine width="w-3/6" height="h-6" animated />
          <TextLine width="w-3/6" height="h-6" animated />
        </Stack>

        <Stack direction="row" justify="center" align="center" spacing="gap-y-3" fullWidth>
          <TextLine width="w-2/6" height="h-5" animated />
          <Text variant="subtitle2" color={{ light: 'secondaryLight', dark: 'secondaryDark' }}>
            |
          </Text>
          <TextLine width="w-2/6" height="h-5" animated />
        </Stack>

        <TextLine width="w-full" height="h-5" animated />

        <TextLine
          title="followButton"
          width="w-[5rem]"
          height="h-[1.5rem]"
          round="rounded"
          animated
        />
      </Stack>
    </Card>
  );
};

export default MiniProfileWidgetLoader;

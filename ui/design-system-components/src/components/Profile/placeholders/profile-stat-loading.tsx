import React from 'react';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import CircularPlaceholder from '@akashaorg/design-system-core/lib/components/CircularPlaceholder';
import TextLine from '@akashaorg/design-system-core/lib/components/TextLine';

const ProfileStatLoading: React.FC = () => {
  return (
    <Card elevation="1" radius={20} padding={'p-4'}>
      <Stack spacing="gap-4" fullWidth>
        <TextLine width="w-20" animated />
        <Stack direction="row" justify="between">
          <Stack spacing="gap-2">
            <CircularPlaceholder height="h-12" width="w-12" customStyle="shrink-0" animated />
            <Stack spacing="gap-1">
              <TextLine width="w-11" animated />
              <TextLine width="w-11" animated />
            </Stack>
          </Stack>
          <Stack spacing="gap-2">
            <CircularPlaceholder height="h-12" width="w-12" customStyle="shrink-0" />
            <Stack spacing="gap-1">
              <TextLine width="w-11" animated />
              <TextLine width="w-11" animated />
            </Stack>
          </Stack>
          <Stack spacing="gap-2">
            <CircularPlaceholder height="h-12" width="w-12" customStyle="shrink-0" animated />
            <Stack spacing="gap-1">
              <TextLine width="w-11" animated />
              <TextLine width="w-11" animated />
            </Stack>
          </Stack>
          <Stack spacing="gap-2" customStyle="w-fit">
            <CircularPlaceholder height="h-12" width="w-12" customStyle="shrink-0" animated />
            <Stack spacing="gap-1">
              <TextLine width="w-11" animated />
              <TextLine width="w-11" animated />
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </Card>
  );
};

export default ProfileStatLoading;

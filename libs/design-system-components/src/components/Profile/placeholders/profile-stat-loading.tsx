import React from 'react';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import TextLine from '@akashaorg/design-system-core/lib/components/TextLine';

const ProfileStatLoading: React.FC = () => {
  return (
    <Card radius={20} padding={'p-4'}>
      <Stack direction="row" justify="between">
        <Stack spacing="gap-2">
          <TextLine
            round="rounded-full"
            height="h-12"
            width="w-12"
            customStyle="shrink-0"
            animated={true}
          />
          <Stack spacing="gap-1">
            <TextLine height="h-[18px]" width="w-11" animated />
            <TextLine height="h-[18px]" width="w-11" animated />
          </Stack>
        </Stack>
        <Stack spacing="gap-2">
          <TextLine round="rounded-full" height="h-12" width="w-12" customStyle="shrink-0" />
          <Stack spacing="gap-1">
            <TextLine height="h-[18px]" width="w-11" animated />
            <TextLine height="h-[18px]" width="w-11" animated />
          </Stack>
        </Stack>
        <Stack spacing="gap-2">
          <TextLine
            round="rounded-full"
            height="h-12"
            width="w-12"
            customStyle="shrink-0"
            animated={true}
          />
          <Stack spacing="gap-1">
            <TextLine height="h-[18px]" width="w-11" animated />
            <TextLine height="h-[18px]" width="w-11" animated />
          </Stack>
        </Stack>
        <Stack spacing="gap-2" customStyle="w-fit">
          <TextLine
            round="rounded-full"
            height="h-12"
            width="w-12"
            customStyle="shrink-0"
            animated={true}
          />
          <Stack spacing="gap-1">
            <TextLine height="h-[18px]" width="w-11" animated />
            <TextLine height="h-[18px]" width="w-11" animated />
          </Stack>
        </Stack>
      </Stack>
    </Card>
  );
};

export default ProfileStatLoading;

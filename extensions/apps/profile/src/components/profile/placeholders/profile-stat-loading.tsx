import React from 'react';
import { Card } from '@akashaorg/ui/lib/akasha-components/card';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import TextLine from '@akashaorg/design-system-core/lib/components/TextLine';

const ProfileStatLoading: React.FC = () => {
  return (
    <Card className="p-4">
      <Stack direction="row" justifyContent="between">
        <Stack spacing={2}>
          <TextLine
            round="rounded-full"
            height="h-12"
            width="w-12"
            customStyle="shrink-0"
            animated={true}
          />
          <Stack spacing={1}>
            <TextLine height="h-[18px]" width="w-11" animated />
            <TextLine height="h-[18px]" width="w-11" animated />
          </Stack>
        </Stack>
        <Stack spacing={2}>
          <TextLine round="rounded-full" height="h-12" width="w-12" customStyle="shrink-0" />
          <Stack spacing={1}>
            <TextLine height="h-[18px]" width="w-11" animated />
            <TextLine height="h-[18px]" width="w-11" animated />
          </Stack>
        </Stack>
        <Stack spacing={2}>
          <TextLine
            round="rounded-full"
            height="h-12"
            width="w-12"
            customStyle="shrink-0"
            animated={true}
          />
          <Stack spacing={1}>
            <TextLine height="h-[18px]" width="w-11" animated />
            <TextLine height="h-[18px]" width="w-11" animated />
          </Stack>
        </Stack>
        <Stack spacing={2} className="w-fit">
          <TextLine
            round="rounded-full"
            height="h-12"
            width="w-12"
            customStyle="shrink-0"
            animated={true}
          />
          <Stack spacing={1}>
            <TextLine height="h-[18px]" width="w-11" animated />
            <TextLine height="h-[18px]" width="w-11" animated />
          </Stack>
        </Stack>
      </Stack>
    </Card>
  );
};

export default ProfileStatLoading;

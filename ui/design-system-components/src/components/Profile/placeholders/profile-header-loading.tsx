import React from 'react';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import CircularPlaceholder from '@akashaorg/design-system-core/lib/components/CircularPlaceholder';
import TextLine from '@akashaorg/design-system-core/lib/components/TextLine';
import Divider from '@akashaorg/design-system-core/lib/components/Divider';

const ProfileHeaderLoading: React.FC = () => {
  return (
    <div>
      <Card
        elevation="1"
        radius={{ top: 20 }}
        background={{ light: 'grey6', dark: 'grey5' }}
        customStyle="h-32"
      ></Card>
      <Card elevation="1" radius={{ bottom: 20 }} padding="px-[0.5rem] pb-[1rem] pt-0">
        <Stack padding="pl-2" fullWidth>
          <Stack spacing="gap-x-2" customStyle="-ml-2">
            <Stack customStyle="relative w-20 h-[3.5rem] shrink-0">
              <CircularPlaceholder customStyle="absolute -top-6" />
            </Stack>
            <Stack spacing="gap-y-1.5" customStyle="mt-1">
              <TextLine width="w-36" animated />
              <TextLine width="w-28" animated />
            </Stack>
            <CircularPlaceholder height="h-8" width="w-8" customStyle="ml-auto shrink-0" animated />
          </Stack>
          <Stack spacing="gap-y-4">
            <Stack spacing="gap-y-1.5">
              <TextLine width="w-40" animated />
              <TextLine animated />
            </Stack>
            <Divider />
            <Stack spacing="gap-y-1.5">
              <TextLine width="w-24" animated />
              <TextLine width="w-72" animated />
            </Stack>
          </Stack>
        </Stack>
      </Card>
    </div>
  );
};

export default ProfileHeaderLoading;

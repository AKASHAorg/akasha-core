import React from 'react';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import TextLine from '@akashaorg/design-system-core/lib/components/TextLine';

const ProfileInterestsLoading: React.FC = () => {
  return (
    <Stack direction="column" spacing="gap-y-4" fullWidth>
      <Card elevation="1" radius={20} padding="p-4">
        <Stack direction="column" spacing="gap-y-2.5" customStyle="mb-16">
          <TextLine width="w-24" animated />
          <TextLine width="w-full" animated />
        </Stack>
        <Stack direction="column" spacing="gap-y-2.5" customStyle="mb-16">
          <TextLine width="w-24" animated />
          <TextLine width="w-6/12" animated />
          <TextLine width="w-full" animated />
        </Stack>
        <Stack direction="row" justify="center" spacing="gap-x-4" customStyle="mt-auto ml-auto">
          <TextLine title="entry-publish-date" height="h-4" width="w-9" animated />
          <TextLine title="entry-publish-date" height="h-4" width="w-9" animated />
        </Stack>
      </Card>
    </Stack>
  );
};

export default ProfileInterestsLoading;

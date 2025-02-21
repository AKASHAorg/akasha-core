import React from 'react';
import { Card } from '@akashaorg/ui/lib/akasha-components/card';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import TextLine from '@akashaorg/design-system-core/lib/components/TextLine';

const ProfileInterestsLoading: React.FC = () => {
  return (
    <Stack direction="column" spacing={4} className="w-full">
      <Card className="p-4">
        <Stack direction="column" spacing={2} className="mb-16">
          <TextLine width="w-24" animated />
          <TextLine width="w-full" animated />
        </Stack>
        <Stack direction="column" spacing={2} className="mb-16">
          <TextLine width="w-24" animated />
          <TextLine width="w-6/12" animated />
          <TextLine width="w-full" animated />
        </Stack>
        <Stack direction="row" justifyContent="center" spacing={4} className="mt-auto ml-auto">
          <TextLine title="entry-publish-date" height="h-4" width="w-9" animated />
          <TextLine title="entry-publish-date" height="h-4" width="w-9" animated />
        </Stack>
      </Card>
    </Stack>
  );
};

export default ProfileInterestsLoading;

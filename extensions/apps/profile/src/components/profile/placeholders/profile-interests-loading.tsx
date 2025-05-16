import React from 'react';
import { Card } from '@akashaorg/ui/lib/akasha-components/card';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import { Skeleton } from '@akashaorg/ui/lib/components/skeleton';

const ProfileInterestsLoading: React.FC = () => {
  return (
    <Stack direction="column" spacing={4} className="w-full">
      <Card className="p-4">
        <Stack direction="column" spacing={2} className="mb-16">
          <Skeleton className="w-24" />
          <Skeleton className="w-full" />
        </Stack>
        <Stack direction="column" spacing={2} className="mb-16">
          <Skeleton className="w-24" />
          <Skeleton className="w-6/12" />
          <Skeleton className="w-full" />
        </Stack>
        <Stack direction="row" justifyContent="center" spacing={4} className="mt-auto ml-auto">
          <Skeleton title="entry-publish-date" className="w-9 h-4"  />
          <Skeleton title="entry-publish-date" className="w-9 h-4"  />
        </Stack>
      </Card>
    </Stack>
  );
};

export default ProfileInterestsLoading;

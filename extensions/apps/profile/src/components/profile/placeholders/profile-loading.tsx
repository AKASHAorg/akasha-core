import React from 'react';
import { Card } from '@akashaorg/ui/lib/akasha-components/card';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import { Skeleton } from '@akashaorg/ui/lib/components/skeleton';
import ProfileStatLoading from './profile-stat-loading';
import ProfileHeaderLoading from './profile-header-loading';

const ProfileLoading: React.FC = () => {
  return (
    <Stack spacing={4}>
      <ProfileHeaderLoading />
      <Card className="p-4">
        <Stack spacing={2}>
          <Skeleton className="w-24" />
          <Stack spacing={1}>
            <Skeleton className="w-full" />
            <Skeleton className="w-full" />
          </Stack>
        </Stack>
      </Card>
      <ProfileStatLoading />
      <Card className="p-4">
        <Stack spacing={2}>
          <Skeleton className="w-24" />
          <Skeleton className="w-full" />
        </Stack>
      </Card>
    </Stack>
  );
};

export default ProfileLoading;

import React from 'react';
import { Card } from '@akashaorg/ui/lib/akasha-components/card';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import { Skeleton } from '@akashaorg/ui/lib/components/skeleton';

const ProfileStatLoading: React.FC = () => {
  return (
    <Card className="p-4">
      <Stack direction="row" justifyContent="between">
        <Stack spacing={2}>
          <Skeleton className="rounded-full h-12 w-12 shrink-0" />
          <Stack spacing={1}>
            <Skeleton className="h-[18px] w-11" />
            <Skeleton className="h-[18px] w-11" />
          </Stack>
        </Stack>
        <Stack spacing={2}>
          <Skeleton className="rounded-full h-12 w-12 shrink-0" />
          <Stack spacing={1}>
            <Skeleton className="h-[18px] w-11" />
            <Skeleton className="h-[18px] w-11" />
          </Stack>
        </Stack>
        <Stack spacing={2}>
          <Skeleton className="rounded-full h-12 w-12 shrink-0" />
          <Stack spacing={1}>
            <Skeleton className="h-[18px] w-11" />
            <Skeleton className="h-[18px] w-11" />
          </Stack>
        </Stack>
        <Stack spacing={2} className="w-fit">
          <Skeleton className="rounded-full h-12 w-12 shrink-0" />
          <Stack spacing={1}>
            <Skeleton className="h-[18px] w-11" />
            <Skeleton className="h-[18px] w-11" />
          </Stack>
        </Stack>
      </Stack>
    </Card>
  );
};

export default ProfileStatLoading;

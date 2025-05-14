import React from 'react';
import { Card } from '@akashaorg/ui/lib/akasha-components/card';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import { Skeleton } from '@akashaorg/ui/lib/components/skeleton';
import { cn } from '@akashaorg/ui/lib/library/utils';

type ProfileHeaderLoadingProps = {
  plain?: boolean;
};
const ProfileHeaderLoading: React.FC<ProfileHeaderLoadingProps> = props => {
  const { plain } = props;
  return (
    <div>
      <Card className={cn('h-32 rounded-b-none', plain ? 'border-none' : 'border-b-0')}></Card>
      <Card
        className={cn(
          'px-[0.5rem] pb-[1rem] pt-0 rounded-t-none border-t-0 overflow-visible',
          plain && 'rounded-b-none border-none',
        )}
      >
        <Stack className="pl-2 w-full">
          <Stack direction="row" spacing={2} className="-ml-2">
            <Stack className="relative w-20 h-[3.5rem] shrink-0">
              <Skeleton className="rounded-full h-20 w-20 shrink-0 absolute -top-6" />
            </Stack>
            <Stack spacing={1} className="mt-1">
              <Skeleton className="w-36" />
              <Skeleton className="w-28" />
              <Skeleton className="w-28" />
            </Stack>
            <Stack direction="row" alignItems="center" spacing={2} className="ml-auto">
              <Skeleton className="rounded-full h-8 w-8 shrink-0" />
              <Skeleton className="rounded-full h-8 w-8 shrink-0" />
            </Stack>
          </Stack>
        </Stack>
      </Card>
    </div>
  );
};

export default ProfileHeaderLoading;

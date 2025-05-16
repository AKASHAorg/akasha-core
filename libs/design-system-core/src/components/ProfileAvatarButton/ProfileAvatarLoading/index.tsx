import React from 'react';
import Stack from '../../Stack';
import { Skeleton } from '@akashaorg/ui/lib/components/skeleton';

type ProfileAvatarLoadingProps = {
  animated?: boolean;
};

const ProfileAvatarLoading: React.FC<ProfileAvatarLoadingProps> = props => {
  const { animated = false } = props;
  return (
    <Stack direction="row" spacing="gap-1">
      <Skeleton className="rounded-full h-10 w-10 shrink-0" />
      <Stack direction="column" justify="center" spacing="gap-y-1">
        <Skeleton className={`w-28 h-4 ${!animated ? 'animate-none' : 'animate-pulse'}`} />
        <Skeleton className={`w-24 h-4 ${!animated ? 'animate-none' : 'animate-pulse'}`} />
      </Stack>
    </Stack>
  );
};

export default ProfileAvatarLoading;

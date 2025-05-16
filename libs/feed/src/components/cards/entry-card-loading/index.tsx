import React, { PropsWithChildren } from 'react';
import { Card } from '@akashaorg/ui/lib/akasha-components/card';
import { Skeleton } from '@akashaorg/ui/lib/components/skeleton';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import ProfileAvatarLoading from '@akashaorg/design-system-core/lib/components/ProfileAvatarButton/ProfileAvatarLoading';

export type EntryLoadingPlaceholderProps = {
  animated?: boolean;
  noWrapperCard?: boolean;
};

const EntryLoadingPlaceholder: React.FC<
  PropsWithChildren<EntryLoadingPlaceholderProps>
> = props => {
  const { animated = true, noWrapperCard, children } = props;
  const loaderUi = (
    <Stack spacing={2} className="p-4 grow min-h-[inherit]">
      <Stack direction="row" alignItems="center" justifyContent="between">
        <ProfileAvatarLoading animated={animated} />
        <Skeleton className="w-4 h-4" />
      </Stack>
      <Stack justifyContent="center" spacing={1}>
        <Skeleton title="entry-publish-date" className="w-full h-4" />
        <Skeleton title="entry-publish-date" className="w-6/12 h-4" />
        {children}
      </Stack>
      <Stack direction="row" justifyContent="center" spacing={4} className="mt-auto ml-auto">
        <Skeleton title="entry-publish-date" className="w-4 h-4" />
        <Skeleton title="entry-publish-date" className="w-9 h-4" />
        <Skeleton title="entry-publish-date" className="w-14 h-4" />
      </Stack>
    </Stack>
  );
  return noWrapperCard ? loaderUi : <Card className="p-0 grow min-h-[inherit]">{loaderUi}</Card>;
};

export default EntryLoadingPlaceholder;

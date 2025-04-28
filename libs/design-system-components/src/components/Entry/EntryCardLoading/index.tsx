import React, { PropsWithChildren } from 'react';
import { Card } from '@akashaorg/ui/lib/akasha-components/card';
import TextLine from '@akashaorg/design-system-core/lib/components/TextLine';
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
        <TextLine width="w-4" height="h-4" animated={animated} />
      </Stack>
      <Stack justifyContent="center" spacing={1}>
        <TextLine title="entry-publish-date" height="h-4" width="w-full" animated={animated} />
        <TextLine title="entry-publish-date" height="h-4" width="w-6/12" animated={animated} />
        {children}
      </Stack>
      <Stack direction="row" justifyContent="center" spacing={4} className="mt-auto ml-auto">
        <TextLine title="entry-publish-date" height="h-4" width="w-4" animated={animated} />
        <TextLine title="entry-publish-date" height="h-4" width="w-9" animated={animated} />
        <TextLine title="entry-publish-date" height="h-4" width="w-14" animated={animated} />
      </Stack>
    </Stack>
  );
  return noWrapperCard ? loaderUi : <Card className="p-0 grow min-h-[inherit]">{loaderUi}</Card>;
};

export default EntryLoadingPlaceholder;

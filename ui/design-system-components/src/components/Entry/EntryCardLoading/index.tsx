import React, { PropsWithChildren } from 'react';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import TextLine from '@akashaorg/design-system-core/lib/components/TextLine';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import AuthorProfileLoading from './author-profile-loading';

export type EntryLoadingPlaceholderProps = {
  animated?: boolean;
  noWrapperCard?: boolean;
};

const EntryLoadingPlaceholder: React.FC<
  PropsWithChildren<EntryLoadingPlaceholderProps>
> = props => {
  const { animated = true, noWrapperCard, children } = props;
  const loaderUi = (
    <Stack spacing="gap-y-2" padding="p-4">
      <Stack direction="row" align="center" justify="between">
        <AuthorProfileLoading animated={animated} />
        <TextLine width="w-4" height="h-4" animated={animated} />
      </Stack>
      <Stack justify="center" spacing="gap-y-1">
        <TextLine title="entry-publish-date" height="h-4" width="w-full" animated={animated} />
        <TextLine title="entry-publish-date" height="h-4" width="w-6/12" animated={animated} />
        {children}
      </Stack>
      <Stack direction="row" justify="center" spacing="gap-x-4" customStyle="mt-auto ml-auto">
        <TextLine title="entry-publish-date" height="h-4" width="w-4" animated={animated} />
        <TextLine title="entry-publish-date" height="h-4" width="w-9" animated={animated} />
        <TextLine title="entry-publish-date" height="h-4" width="w-14" animated={animated} />
      </Stack>
    </Stack>
  );
  return noWrapperCard ? loaderUi : <Card padding="p-0">{loaderUi}</Card>;
};

export default EntryLoadingPlaceholder;

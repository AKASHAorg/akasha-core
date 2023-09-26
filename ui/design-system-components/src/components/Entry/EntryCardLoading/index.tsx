import React from 'react';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import TextLine from '@akashaorg/design-system-core/lib/components/TextLine';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import AuthorProfileLoading from './author-profile-loading';

export type EntryLoadingPlaceholderProps = {
  height?: number;
  animated?: boolean;
  children?: React.ReactNode;
};

const EntryLoadingPlaceholder: React.FC<EntryLoadingPlaceholderProps> = props => {
  const { height = 144, animated = true, children } = props;
  return (
    <Card padding={'p-4'} customStyle={`min-h-[${height / 16}rem]`}>
      <Stack direction="row" align="center" justify="between" customStyle={`pb-4`}>
        <AuthorProfileLoading animated={animated} />
        <TextLine width="w-24" height="h-4" animated={animated} />
      </Stack>
      <Stack direction="column" justify="center" spacing="gap-y-1">
        <TextLine title="entry-publish-date" height="h-4" width="w-6/12" animated={animated} />
        <TextLine title="entry-publish-date" height="h-4" width="w-10/12" animated={animated} />
        <TextLine title="entry-publish-date" height="h-4" width="w-full" animated={animated} />
        {children}
      </Stack>
    </Card>
  );
};

export default EntryLoadingPlaceholder;

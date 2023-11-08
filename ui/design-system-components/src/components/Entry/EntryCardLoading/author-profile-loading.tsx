import React from 'react';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import CircularPlaceholder from '@akashaorg/design-system-core/lib/components/CircularPlaceholder';
import TextLine from '@akashaorg/design-system-core/lib/components/TextLine';

type AuthorProfileLoadingProps = {
  animated?: boolean;
};

const AuthorProfileLoading: React.FC<AuthorProfileLoadingProps> = props => {
  const { animated = false } = props;
  return (
    <Stack direction="row" spacing="gap-1">
      <CircularPlaceholder height="h-10" width="w-10" customStyle="shrink-0" animated={animated} />
      <Stack direction="column" justify="center" spacing="gap-y-1">
        <TextLine width="w-28" height="h-4" animated={animated} />
        <TextLine width="w-24" height="h-4" animated={animated} />
      </Stack>
    </Stack>
  );
};

export default AuthorProfileLoading;

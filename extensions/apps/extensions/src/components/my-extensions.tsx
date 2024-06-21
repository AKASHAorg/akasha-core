import React from 'react';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';

export type MyExtensionsProps = {
  titleLabel: string;
};

export const MyExtensions: React.FC<MyExtensionsProps> = props => {
  const { titleLabel } = props;

  return (
    <Stack spacing="gap-y-4">
      <Text variant="h5">{titleLabel}</Text>
    </Stack>
  );
};

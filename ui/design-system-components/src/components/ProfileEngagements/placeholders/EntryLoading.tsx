import React from 'react';

import CircularPlaceholder from '@akashaorg/design-system-core/lib/components/CircularPlaceholder';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import TextLine from '@akashaorg/design-system-core/lib/components/TextLine';
import { getColorClasses } from '@akashaorg/design-system-core/lib/utils/getColorClasses';

const EntryLoading: React.FC = () => {
  const borderBottomStyle = `border-b ${getColorClasses(
    {
      light: 'grey8',
      dark: 'grey5',
    },
    'border',
  )}`;
  return (
    <Stack align="center" justify="between" customStyle={`px-4 pb-4 ${borderBottomStyle}`}>
      <Stack spacing="gap-1">
        <CircularPlaceholder height="h-10" width="w-10" customStyle="shrink-0" animated />
        <Stack direction="column" justify="center" spacing="gap-y-1">
          <TextLine width="w-24" height="h-4" animated />
          <TextLine width="w-24" height="h-4" animated />
        </Stack>
      </Stack>
      <TextLine width="w-24" animated />
    </Stack>
  );
};

export default EntryLoading;

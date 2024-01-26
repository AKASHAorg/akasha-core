import React from 'react';
import CircularPlaceholder from '@akashaorg/design-system-core/lib/components/CircularPlaceholder';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import TextLine from '@akashaorg/design-system-core/lib/components/TextLine';

type EntryLoadingProps = {
  customStyle?: string;
};
const EntryLoading: React.FC<EntryLoadingProps> = props => {
  const { customStyle } = props;

  return (
    <Stack direction="row" align="center" justify="between" customStyle={`pb-4 ${customStyle}`}>
      <Stack direction="row" spacing="gap-1">
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

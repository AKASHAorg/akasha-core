import React from 'react';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import TextLine from '@akashaorg/design-system-core/lib/components/TextLine';

type EntryLoadingProps = {
  customStyle?: string;
};
const EntryLoading: React.FC<EntryLoadingProps> = props => {
  const { customStyle } = props;

  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="between"
      className={`pb-4 ${customStyle}`}
    >
      <Stack direction="row" spacing={1}>
        <TextLine
          round="rounded-full"
          height="h-10"
          width="w-10"
          customStyle="shrink-0"
          animated={true}
        />
        <Stack direction="column" justifyContent="center" spacing={1}>
          <TextLine width="w-24" height="h-4" animated />
          <TextLine width="w-24" height="h-4" animated />
        </Stack>
      </Stack>
      <TextLine width="w-24" animated />
    </Stack>
  );
};

export default EntryLoading;

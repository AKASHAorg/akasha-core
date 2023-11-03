import React from 'react';

import CircularPlaceholder from '@akashaorg/design-system-core/lib/components/CircularPlaceholder';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import TextLine from '@akashaorg/design-system-core/lib/components/TextLine';
import EntryLoadingPlaceholder from '../../components/Entry/EntryCardLoading';

const AntennaLoader: React.FC = () => {
  return (
    <Stack direction="column" align="center" justify="center" spacing="gap-y-2" fullWidth>
      <Card radius="rounded-2xl" padding="p-0">
        <Stack
          direction="row"
          customStyle="w-full h-fit"
          align="center"
          justify="between"
          fullWidth
        >
          <Stack
            direction="row"
            spacing="gap-x-1"
            align="center"
            justify="start"
            customStyle="w-9/12 pl-4"
          >
            <CircularPlaceholder height="h-10" width="w-10" customStyle="shrink-0" animated />
            <TextLine animated={true} width="w-4/5" />
          </Stack>
          <Stack justify="center" customStyle="w-3/12">
            <TextLine animated={true} width="w-4/5" />
          </Stack>
        </Stack>
      </Card>
      {Array.from({ length: 4 }).map((el, index: number) => (
        <EntryLoadingPlaceholder key={index} />
      ))}
    </Stack>
  );
};

export default AntennaLoader;

import React from 'react';

import CircularPlaceholder from '@akashaorg/design-system-core/lib/components/CircularPlaceholder';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import TextLine from '@akashaorg/design-system-core/lib/components/TextLine';

const AntennaLoader: React.FC = () => {
  return (
    <Stack direction="column" align="center" justify="center" spacing="gap-y-2">
      <Card radius="rounded-2xl">
        <Stack direction="row" customStyle="w-full h-fit" align="center" justify="between">
          <Stack direction="row" spacing="gap-x-1" align="center" justify="center">
            <CircularPlaceholder height="h-10" width="w-10" customStyle="shrink-0" animated />
            <TextLine title="tagName" animated={true} width="w-24 lg:w-64" />
          </Stack>
          <Stack justify="center" customStyle={'w-fit'}>
            <TextLine title="tagName" animated={true} width="w-16 lg:w-32" />
          </Stack>
        </Stack>
      </Card>
      {Array.from({ length: 4 }).map(() => (
        <Card radius="rounded-2xl">
          <Stack direction="column" align="start" justify="center" spacing="gap-y-4">
            <Stack direction="row" align="start" justify="between" fullWidth>
              <Stack direction="row" align="center" justify="center" spacing="gap-x-1">
                <CircularPlaceholder height="h-10" width="w-10" customStyle="shrink-0" animated />
                <Stack direction="column" align="center" justify="between" spacing="gap-y-1">
                  <TextLine title="tagName" animated={true} width="w-[147px]" />
                  <TextLine title="tagName" animated={true} width="w-[147px]" />
                </Stack>
              </Stack>
              <Stack direction="row" align="center" justify="center" customStyle="h-full">
                <TextLine title="tagName" animated={true} width="w-[16px]" />
              </Stack>
            </Stack>
            <Stack direction="row" align="start" justify="between">
              <Stack
                direction="row"
                align="center"
                justify="center"
                spacing="gap-x-1"
                customStyle="pb-12"
              >
                <Stack direction="column" align="start" justify="between" spacing="gap-y-1">
                  <TextLine
                    title="tagName"
                    animated={true}
                    width="lg:w-[32rem] w-64"
                    height={'h-6'}
                  />
                  <TextLine title="tagName" animated={true} width="w-40 lg:w-72" height={'h-6'} />
                </Stack>
              </Stack>
            </Stack>
            {/* lowest button line */}
            <Stack direction="row" align="center" justify="end" fullWidth>
              <Stack direction="row" align="center" justify="between" spacing="gap-x-4">
                <TextLine title="tagName" animated={true} width="w-[16px]" />
                <TextLine title="tagName" animated={true} width="w-9" />
                <TextLine title="tagName" animated={true} width="w-14" />
              </Stack>
            </Stack>
          </Stack>
        </Card>
      ))}
    </Stack>
  );
};

export default AntennaLoader;

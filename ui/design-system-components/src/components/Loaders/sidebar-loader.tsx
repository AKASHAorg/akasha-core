import React from 'react';

import CircularPlaceholder from '@akashaorg/design-system-core/lib/components/CircularPlaceholder';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import TextLine from '@akashaorg/design-system-core/lib/components/TextLine';

const SidebarLoader: React.FC = () => {
  return (
    <Card
      customStyle="w-[19.5rem] max-w-[19.5rem] max-h(screen xl:[calc(100vh-20px)]) h(full xl:fit) space-y-4"
      radius="rounded-r-2xl xl:rounded-2xl"
      padding={'p-0'}
    >
      <Stack direction="column" justifyItems="stretch" padding={'px-6 pt-6'} spacing="gap-y-4">
        <Stack direction="row" customStyle="w-full h-fit justify-between">
          <Stack direction="row" spacing="gap-x-1">
            <CircularPlaceholder height="h-10" width="w-10" customStyle="shrink-0" animated />
            <Stack
              direction="column"
              spacing="gap-y-1"
              customStyle="max-w(xl:[10rem] lg:[8rem] md:[10rem] xs:[2rem])"
            >
              <TextLine title="tagName" animated={true} width="w-[147px]" />
              <TextLine title="tagName" animated={true} width="w-[147px]" />
            </Stack>
          </Stack>
          <Stack justify="center" customStyle={'w-fit'}>
            <CircularPlaceholder height="h-10" width="w-10" customStyle="shrink-0" animated />
          </Stack>
        </Stack>

        {/*
          first accordion menu
        */}
        <Stack direction="row" align="center" justify="between">
          <Stack direction="row" align="center" justify="center" spacing="gap-x-1">
            <CircularPlaceholder height="h-10" width="w-10" customStyle="shrink-0" animated />
            <TextLine title="tagName" animated={true} width="w-[147px]" />
          </Stack>
          <Stack direction="row" align="center" justify="center" customStyle="h-full">
            <TextLine title="tagName" animated={true} width="w-[16px]" />
          </Stack>
        </Stack>

        <Stack direction="row" align="center" justify="between">
          <Stack direction="column" align="center" justify="center" spacing="gap-x-1">
            <Stack customStyle={`mx-4 pl-6 border(l-4 grey9 dark:grey3`} align="center">
              <Stack direction="column" align="center" justify="around" customStyle="h-16">
                <TextLine title="tagName" animated={true} width="w-[147px]" />
                <TextLine title="tagName" animated={true} width="w-[147px]" />
              </Stack>
            </Stack>
          </Stack>
        </Stack>
        {/*
          menu without accordion
        */}
        <Stack direction="row" align="center" justify="between">
          <Stack direction="row" align="center" justify="center" spacing="gap-x-1">
            <CircularPlaceholder height="h-10" width="w-10" customStyle="shrink-0" animated />
            <TextLine title="tagName" animated={true} width="w-[147px]" />
          </Stack>
        </Stack>
        {/*
          another accordion menu
        */}
        <Stack direction="row" align="center" justify="between">
          <Stack direction="row" align="center" justify="center" spacing="gap-x-1">
            <CircularPlaceholder height="h-10" width="w-10" customStyle="shrink-0" animated />
            <TextLine title="tagName" animated={true} width="w-[147px]" />
          </Stack>
          <Stack direction="row" align="center" justify="center" customStyle="h-full">
            <TextLine title="tagName" animated={true} width="w-[16px]" />
          </Stack>
        </Stack>
        {Array.from({ length: 4 }).map((el, index: number) => (
          <Stack direction="row" align="center" justify="between" key={index}>
            <Stack direction="row" align="center" justify="center" spacing="gap-x-1">
              <CircularPlaceholder height="h-10" width="w-10" customStyle="shrink-0" animated />
              <TextLine title="tagName" animated={true} width="w-[147px]" />
            </Stack>
          </Stack>
        ))}
        {/*
          another accordion menu
        */}
        <Stack direction="row" align="center" justify="between">
          <Stack direction="row" align="center" justify="center" spacing="gap-x-1">
            <CircularPlaceholder height="h-10" width="w-10" customStyle="shrink-0" animated />
            <TextLine title="tagName" animated={true} width="w-[147px]" />
          </Stack>
          <Stack direction="row" align="center" justify="center" customStyle="h-full">
            <TextLine title="tagName" animated={true} width="w-[16px]" />
          </Stack>
        </Stack>
      </Stack>
      <TextLine title="tagName" animated={true} width="w-full" height="h-[102px]" round="rounded" />
      {/*
          social icon section
        */}
      <Stack
        direction="column"
        align="start"
        justify="between"
        spacing="gap-y-2"
        padding={'px-6 pb-6'}
      >
        <TextLine title="social links" animated={true} width="w-[147px]" />

        <Stack direction="row" align="center" justify="center" spacing="gap-x-1">
          {Array.from({ length: 4 }).map((el, index: number) => (
            <React.Fragment key={index}>
              <CircularPlaceholder height="h-10" width="w-10" customStyle="shrink-0" animated />
            </React.Fragment>
          ))}
        </Stack>
      </Stack>
    </Card>
  );
};

export default SidebarLoader;

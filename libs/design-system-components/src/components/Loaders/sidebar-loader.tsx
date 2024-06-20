import React from 'react';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import TextLine from '@akashaorg/design-system-core/lib/components/TextLine';

/**
 * Component used to display a skeleton placeholder for data loading
 * in the sidebar widget
 */
const SidebarLoader: React.FC = () => {
  return (
    <Card
      customStyle="w-[19.5rem] max-w-[19.5rem] max-h(screen xl:[calc(100vh-20px)]) h(full xl:fit) space-y-4"
      radius="rounded-r-2xl xl:rounded-2xl"
      padding={'p-0'}
    >
      <Stack
        direction="column"
        padding="px-6 pt-6"
        spacing="gap-y-4"
        fullWidth
        customStyle="h(screen xl:[calc(100vh-20px)])"
      >
        <Stack direction="row" customStyle="w-full h-fit justify-between" fullWidth>
          <Stack direction="row" spacing="gap-x-1" fullWidth>
            <TextLine
              round="rounded-full"
              height="h-10"
              width="w-10"
              customStyle="shrink-0"
              animated={true}
            />
            <Stack
              direction="column"
              spacing="gap-y-1"
              customStyle="max-w(xl:[10rem] lg:[8rem] md:[10rem] xs:[2rem])"
              fullWidth
            >
              <TextLine title="tagName" animated={true} width="w-8/12" />
              <TextLine title="tagName" animated={true} width="w-8/12" />
            </Stack>
          </Stack>
          <Stack justify="between" customStyle={'w-fit'}>
            <TextLine
              round="rounded-full"
              height="h-10"
              width="w-10"
              customStyle="shrink-0"
              animated={true}
            />
          </Stack>
        </Stack>
      </Stack>
    </Card>
  );
};

export default SidebarLoader;

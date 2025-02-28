import React from 'react';
import { Card } from '@akashaorg/ui/lib/akasha-components/card';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import TextLine from '@akashaorg/design-system-core/lib/components/TextLine';

/**
 * Component used to display a skeleton placeholder for data loading
 * in the sidebar widget
 */
const SidebarLoader: React.FC = () => {
  return (
    <Card className="p-0 rounded-r-2xl xl:rounded-2xl w-[19.5rem] max-w-[19.5rem] max-h-screen xl:max-h-[calc(100vh-20px)] h-full xl:h-fit space-y-4">
      <Stack
        direction="column"
        spacing={4}
        className="px-6 pt-6 w-full h(screen xl:[calc(100vh-20px)])"
      >
        <Stack direction="row" className="w-full h-fit justify-between w-full">
          <Stack direction="row" spacing={1} className="w-full">
            <TextLine
              round="rounded-full"
              height="h-10"
              width="w-10"
              customStyle="shrink-0"
              animated={true}
            />
            <Stack
              direction="column"
              spacing={1}
              className="max-w(xl:[10rem] lg:[8rem] md:[10rem] xs:[2rem]) w-full"
            >
              <TextLine title="tagName" animated={true} width="w-8/12" />
              <TextLine title="tagName" animated={true} width="w-8/12" />
            </Stack>
          </Stack>
          <Stack justifyContent="between" className="w-fit">
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

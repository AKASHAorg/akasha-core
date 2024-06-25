import React from 'react';
import { startWidgetsTogglingBreakpoint } from '@akashaorg/design-system-core/lib/utils/breakpoints';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import TextLine from '@akashaorg/design-system-core/lib/components/TextLine';

/**
 * Component used to display a skeleton placeholder for data loading
 * in the topbar widget
 */
const TopbarLoader: React.FC = () => {
  return (
    <div>
      <Card
        padding="p-0"
        customStyle="flex-row justify-between items-center py-1.5 px-2 space-x-4 xs:(fixed top-0 z-[8]) w-full"
      >
        <Stack direction="row" spacing="gap-x-2">
          {Array.from({ length: 2 }).map((el, index: number) => (
            <TextLine
              round="rounded-full"
              key={index}
              height="h-8"
              width="w-8"
              customStyle="shrink-0"
              animated={true}
            />
          ))}
        </Stack>
        <TextLine
          round="rounded-full"
          height="h-10"
          width="w-10"
          customStyle="shrink-0"
          animated={true}
        />
        <Stack direction="row" spacing="gap-x-2">
          {window.matchMedia(startWidgetsTogglingBreakpoint).matches ? (
            <TextLine
              round="rounded-full"
              height="h-8"
              width="w-8"
              customStyle="shrink-0"
              animated={true}
            />
          ) : (
            Array.from({ length: 2 }).map((el, index: number) => (
              <TextLine
                round="rounded-full"
                key={index}
                height="h-8"
                width="w-8"
                customStyle="shrink-0"
                animated={true}
              />
            ))
          )}
        </Stack>
      </Card>
    </div>
  );
};

export default TopbarLoader;

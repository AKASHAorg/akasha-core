import React from 'react';

import { startWidgetsTogglingBreakpoint } from '@akashaorg/design-system-core/lib/utils/breakpoints';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import CircularPlaceholder from '@akashaorg/design-system-core/lib/components/CircularPlaceholder';

const TopbarLoader: React.FC = () => {
  return (
    <div>
      <Card
        padding="p-0"
        customStyle="flex-row justify-between items-center py-1.5 px-2 space-x-4 xs:(fixed top-0 z-[8]) w-full"
      >
        <Stack direction="row" spacing="gap-x-2">
          {Array.from({ length: 2 }).map((el, index: number) => (
            <CircularPlaceholder
              key={index}
              height="h-8"
              width="w-8"
              customStyle="shrink-0"
              animated
            />
          ))}
        </Stack>
        <CircularPlaceholder height="h-10" width="w-10" customStyle="shrink-0" animated />
        <Stack direction="row" spacing="gap-x-2">
          {window.matchMedia(startWidgetsTogglingBreakpoint).matches ? (
            <CircularPlaceholder height="h-8" width="w-8" customStyle="shrink-0" animated />
          ) : (
            Array.from({ length: 2 }).map((el, index: number) => (
              <CircularPlaceholder
                key={index}
                height="h-8"
                width="w-8"
                customStyle="shrink-0"
                animated
              />
            ))
          )}
        </Stack>
      </Card>
    </div>
  );
};

export default TopbarLoader;

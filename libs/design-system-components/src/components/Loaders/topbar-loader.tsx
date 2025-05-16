import React from 'react';
import { startWidgetsTogglingBreakpoint } from '@akashaorg/design-system-core/lib/utils/breakpoints';
import { Card } from '@akashaorg/ui/lib/akasha-components/card';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import { Skeleton } from '@akashaorg/ui/lib/components/skeleton';

/**
 * Component used to display a skeleton placeholder for data loading
 * in the topbar widget
 */
const TopbarLoader: React.FC = () => {
  return (
    <div>
      <Card className="p-0 flex flex-row justify-between items-center py-1.5 px-2 space-x-4 w-full xs:fixed xs:top-0 xs:z-[8]">
        <Stack direction="row" spacing={2}>
          {Array.from({ length: 2 }).map((el, index: number) => (
            <Skeleton key={index} className="rounded-full h-8 w-8 shrink-0" />
          ))}
        </Stack>
        <Skeleton className="rounded-full h-10 w-10 shrink-0" />
        <Stack direction="row" spacing={2}>
          {window.matchMedia(startWidgetsTogglingBreakpoint).matches ? (
            <Skeleton className="rounded-full h-8 w-8 shrink-0" />
          ) : (
            Array.from({ length: 2 }).map((el, index: number) => (
              <Skeleton key={index} className="rounded-full h-8 w-8 shrink-0" />
            ))
          )}
        </Stack>
      </Card>
    </div>
  );
};

export default TopbarLoader;

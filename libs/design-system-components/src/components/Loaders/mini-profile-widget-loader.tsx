import React from 'react';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import { Card } from '@akashaorg/ui/lib/akasha-components/card';
import { Typography } from '@akashaorg/ui/lib/akasha-components/typography';
import { Skeleton } from '@akashaorg/ui/lib/components/skeleton';

/**
 * Component used to display a skeleton placeholder for data loading
 * in the mini profile widget
 */
const MiniProfileWidgetLoader: React.FC = () => {
  return (
    <Card className="mb-4 p-0 max-h-[30rem]">
      <Stack alignItems="center" className="bg-inherit h-28 rounded-t-2xl w-full">
        <Stack className="relative top-16">
          <Skeleton className="rounded-full h-20 w-20 shrink-0" />
        </Stack>
      </Stack>
      <Stack spacing={4} alignItems="center" className="p-4 pt-6 w-full">
        <Stack spacing={1} alignItems="center" className="pt-3 w-full">
          <Skeleton className="w-3/6 h-5" />
          <Skeleton className="w-3/6 h-5" />
        </Stack>
        <Stack
          direction="row"
          justifyContent="center"
          alignItems="center"
          spacing={2}
          className="w-full"
        >
          <Skeleton className="w-2/6 h-5" />
          <Typography variant="sm" className="font-light text-grey4 dark:text-grey6">
            |
          </Typography>
          <Skeleton className="w-2/6 h-5" />
          <Typography variant="sm" className="font-light text-grey4 dark:text-grey6">
            |
          </Typography>
          <Skeleton className="w-2/6 h-5" />
        </Stack>
        <Skeleton className="w-full h-5" />
        <Skeleton title="followButton" className="rounded w-[5rem] [1.5rem]" />
      </Stack>
    </Card>
  );
};
export default MiniProfileWidgetLoader;

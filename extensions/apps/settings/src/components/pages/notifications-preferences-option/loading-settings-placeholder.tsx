import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import { Typography } from '@akashaorg/ui/lib/akasha-components/typography';
import { Skeleton } from '@akashaorg/ui/lib/components/skeleton';
import React from 'react';
const LoadingSettingsPlaceholder: React.FC = () => (
  <>
    <Stack className="border-b border-border mb-4 pb-4">
      <Stack direction="row" justifyContent="between" alignItems="center" className="mt-4">
        <Skeleton className="w-1/4 h-[1.5rem] rounded" />
        <Skeleton className="w-[1.5rem] h-[1.5rem] rounded" />
      </Stack>

      <Typography variant="xs" className="font-medium font-normal dark:text-grey6 text-grey4 mt-2">
        <Skeleton className="w-2/3 h-[1rem] rounded" />
      </Typography>
    </Stack>

    <Stack>
      <Stack direction="row" justifyContent="between" alignItems="center" className="mt-4">
        <Skeleton className="w-1/4 h-[1.5rem] rounded" />
        <Skeleton className="w-[1.5rem] h-[1.5rem] rounded" />
      </Stack>

      <Typography variant="xs" className="font-medium font-normal dark:text-grey6 text-grey4 mt-2">
        <Skeleton className="w-2/3 h-[1rem] rounded" />
      </Typography>
    </Stack>
  </>
);
export default LoadingSettingsPlaceholder;

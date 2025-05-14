import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import { Typography } from '@akashaorg/ui/lib/akasha-components/typography';
import TextLine from '@akashaorg/design-system-core/lib/components/TextLine';
import React from 'react';
const LoadingSettingsPlaceholder: React.FC = () => (
  <>
    <Stack className="border-b border-border mb-4 pb-4">
      <Stack direction="row" justifyContent="between" alignItems="center" className="mt-4">
        <TextLine animated={true} width="w-1/4" height="h-[1.5rem]" round="rounded" />
        <TextLine animated={true} width="w-[1.5rem]" height="h-[1.5rem]" round="rounded" />
      </Stack>

      <Typography variant="xs" className="font-medium font-normal dark:text-grey6 text-grey4 mt-2">
        <TextLine animated={true} width="w-2/3" height="h-[1rem]" round="rounded" />
      </Typography>
    </Stack>

    <Stack>
      <Stack direction="row" justifyContent="between" alignItems="center" className="mt-4">
        <TextLine animated={true} width="w-1/4" height="h-[1.5rem]" round="rounded" />
        <TextLine animated={true} width="w-[1.5rem]" height="h-[1.5rem]" round="rounded" />
      </Stack>

      <Typography variant="xs" className="font-medium font-normal dark:text-grey6 text-grey4 mt-2">
        <TextLine animated={true} width="w-2/3" height="h-[1rem]" round="rounded" />
      </Typography>
    </Stack>
  </>
);
export default LoadingSettingsPlaceholder;

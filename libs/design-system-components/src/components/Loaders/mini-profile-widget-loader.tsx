import React from 'react';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import { Card } from '@akashaorg/ui/lib/akasha-components/card';
import { Typography } from '@akashaorg/ui/lib/akasha-components/typography';
import TextLine from '@akashaorg/design-system-core/lib/components/TextLine';

/**
 * Component used to display a skeleton placeholder for data loading
 * in the mini profile widget
 */
const MiniProfileWidgetLoader: React.FC = () => {
  return (
    <Card className="mb-4 p-0 max-h-[30rem]">
      <Stack alignItems="center" className="bg-inherit h-28 rounded-t-2xl w-full">
        <Stack className="relative top-16">
          <TextLine round="rounded-full" height="h-20" width="w-20" customStyle="shrink-0" />
        </Stack>
      </Stack>
      <Stack spacing={4} alignItems="center" className="p-4 pt-6 w-full">
        <Stack spacing={1} alignItems="center" className="pt-3 w-full">
          <TextLine width="w-3/6" height="h-5" animated />
          <TextLine width="w-3/6" height="h-5" animated />
        </Stack>
        <Stack
          direction="row"
          justifyContent="center"
          alignItems="center"
          spacing={2}
          className="w-full"
        >
          <TextLine width="w-2/6" height="h-5" animated />
          <Typography variant="sm" className="font-light text-grey4 dark:text-grey6">
            |
          </Typography>
          <TextLine width="w-2/6" height="h-5" animated />
          <Typography variant="sm" className="font-light text-grey4 dark:text-grey6">
            |
          </Typography>
          <TextLine width="w-2/6" height="h-5" animated />
        </Stack>
        <TextLine width="w-full" height="h-5" animated />
        <TextLine
          title="followButton"
          width="w-[5rem]"
          height="h-[1.5rem]"
          round="rounded"
          animated
        />
      </Stack>
    </Card>
  );
};
export default MiniProfileWidgetLoader;

import React from 'react';
import { Card } from '@akashaorg/ui/lib/akasha-components/card';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import { Typography } from '@akashaorg/ui/lib/akasha-components/typography';
export type ReportsHeaderProps = {
  introLabel: string;
  reportLabel: string;
};
export const ReportsHeader: React.FC<ReportsHeaderProps> = props => {
  const { introLabel, reportLabel } = props;
  return (
    <Card className="p-4">
      <Stack spacing={4}>
        <Stack direction="row" alignItems="center" justifyContent="between">
          <Typography variant="h6" className="text-grey5 dark:text-grey6">
            {introLabel}
          </Typography>
          <Stack className="p-2 w-fit rounded-full bg-secondaryLight/30 dark:bg-secondaryDark">
            <Typography variant="xs" className="font-medium text-secondaryLight dark:text-grey2">
              {reportLabel}
            </Typography>
          </Stack>
        </Stack>
      </Stack>
    </Card>
  );
};

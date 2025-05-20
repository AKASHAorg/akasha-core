import React from 'react';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import { Typography } from '@akashaorg/ui/lib/akasha-components/typography';
export type TApplicationStatus = 'pending' | 'approved' | 'rejected' | 'withdrawn';
export const getApplicationStatusColor = (status: TApplicationStatus) => {
  if (status === 'pending') return 'bg-warningLight dark:bg-warningDark';
  if (status === 'approved') return 'bg-success';
  if (status === 'rejected') return 'bg-errorLight bg-errorDark';
  return 'bg-grey6';
};
export const renderStatusDetail = (status: TApplicationStatus) => (
  <Stack direction="row" alignItems="center" spacing={1}>
    <Stack className={`w-2 h-2 rounded-full ${getApplicationStatusColor(status)}`} />
    <Typography variant="sm" bold>
      {`${status.charAt(0).toLocaleUpperCase()}${status.substring(1)}`}
    </Typography>
  </Stack>
);

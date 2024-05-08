import React from 'react';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';

export type TApplicationStatus = 'pending' | 'approved' | 'rejected' | 'withdrawn';

export const getApplicationStatusColor = (status: TApplicationStatus) => {
  if (status === 'pending') return 'bg(warningLight dark:warningDark)';
  if (status === 'approved') return 'bg-success';
  if (status === 'rejected') return 'bg(errorLight dark: errorDark)';
  return 'bg-grey6';
};

export const renderStatusDetail = (status: TApplicationStatus) => (
  <Stack direction="row" align="center" spacing="gap-x-1">
    <Stack customStyle={`w-2 h-2 rounded-full ${getApplicationStatusColor(status)}`} />
    <Text variant="body2" weight="bold">
      {`${status.charAt(0).toLocaleUpperCase()}${status.substring(1)}`}
    </Text>
  </Stack>
);

import React from 'react';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';
import { ChevronRightIcon } from '@akashaorg/design-system-core/lib/components/Icon/hero-icons-outline';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import { Typography } from '@akashaorg/ui/lib/akasha-components/typography';
import { formatDate } from '@akashaorg/design-system-core/lib/utils';
import { TApplicationStatus, getApplicationStatusColor } from './status-color';
export const renderName = (name: string) => (
  <Typography variant="sm" className="text-secondaryLight dark:text-secondaryDark">
    {name}
  </Typography>
);
export const renderDate = (date: Date) => (
  <Typography variant="sm">{formatDate(date.toISOString(), 'DD MMM YYYY')}</Typography>
);
export const renderStatus = (status: TApplicationStatus) => (
  <Stack direction="row" align="center" spacing="gap-x-1">
    <Stack customStyle={`w-2 h-2 rounded-full ${getApplicationStatusColor(status)}`} />
    <Typography variant="sm">{`${status.charAt(0).toLocaleUpperCase()}${status.substring(1)}`}</Typography>
  </Stack>
);
export const renderChevron = () => (
  <Stack align="end">
    <Icon icon={<ChevronRightIcon />} accentColor={true} />
  </Stack>
);

import React from 'react';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';
import { ChevronRightIcon } from '@akashaorg/design-system-core/lib/components/Icon/hero-icons-outline';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import { formatDate } from '@akashaorg/design-system-core/lib/utils';
import { TApplicationStatus, getApplicationStatusColor } from './status-color';

export const renderName = (name: string) => (
  <Text variant="body2" color={{ light: 'secondaryLight', dark: 'secondaryDark' }}>
    {name}
  </Text>
);

export const renderDate = (date: Date) => (
  <Text variant="body2">{formatDate(date.toISOString(), 'DD MMM YYYY')}</Text>
);

export const renderStatus = (status: TApplicationStatus) => (
  <Stack direction="row" align="center" spacing="gap-x-1">
    <Stack customStyle={`w-2 h-2 rounded-full ${getApplicationStatusColor(status)}`} />
    <Text variant="body2">{`${status.charAt(0).toLocaleUpperCase()}${status.substring(1)}`}</Text>
  </Stack>
);

export const renderChevron = () => (
  <Stack align="end">
    <Icon icon={<ChevronRightIcon />} accentColor={true} />
  </Stack>
);

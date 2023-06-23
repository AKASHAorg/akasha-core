import React from 'react';
import dayjs from 'dayjs';

import Box from '@akashaorg/design-system-core/lib/components/Box';
import Text from '@akashaorg/design-system-core/lib/components/Text';

export type IMenuItem = {
  label?: string;
  icon?: string;
  iconColor?: string;
  plain?: boolean;
  handler?: (arg1?: React.SyntheticEvent) => void;
  disabled?: boolean;
};

export type DevKeyCardType = {
  id: string;
  name?: string;
  addedAt: string;
  usedAt?: string;
};

export type DevKeyCardProps = {
  item?: DevKeyCardType;
  nonameLabel: string;
  usedLabel: string;
  unusedLabel: string;
  pendingConfirmationLabel?: string;
  devPubKeyLabel: string;
  dateAddedLabel: string;
};

export const DevKeyCard: React.FC<DevKeyCardProps> = props => {
  const {
    item,
    nonameLabel,
    pendingConfirmationLabel,
    usedLabel,
    unusedLabel,
    devPubKeyLabel,
    dateAddedLabel,
  } = props;

  if (!item) {
    return null;
  }

  return (
    <Box customStyle="space-y-2 relative p-4 bg-(grey9 dark:grey3) rounded-[1.25rem]">
      {/* key name section */}
      <Box customStyle="flex items-center justify-between">
        <Box customStyle="flex space-x-2 items-center">
          <Text weight="bold">{item?.name?.length ? item?.name : nonameLabel}</Text>

          <Box
            customStyle={`w-2 h-2 rounded-full bg-(${
              item?.usedAt ? 'success' : 'warningLight dark: warningDark'
            })`}
          />

          {pendingConfirmationLabel && <Text>{pendingConfirmationLabel}</Text>}

          {!pendingConfirmationLabel && <Text>{item?.usedAt ? usedLabel : unusedLabel}</Text>}
        </Box>

        {/* add menu dropdown */}
      </Box>

      {/* dev public key section */}
      <Box>
        <Text variant="h6" weight="bold">
          {devPubKeyLabel}
        </Text>

        <Text color={{ light: 'secondaryLight', dark: 'secondaryDark' }}>{item?.id}</Text>
      </Box>

      {/* date added section */}
      <Box>
        <Text variant="h6" weight="bold">
          {dateAddedLabel}
        </Text>

        <Text>{dayjs(item?.addedAt).format('DD/MM/YYYY')}</Text>
      </Box>
    </Box>
  );
};

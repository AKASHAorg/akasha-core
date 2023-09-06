import React from 'react';
import dayjs from 'dayjs';

import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Button from '@akashaorg/design-system-core/lib/components/Button';
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
  editable?: boolean;
  onEditButtonClick?: () => void;
  onDeleteButtonClick?: () => void;
};

const DevKeyCard: React.FC<DevKeyCardProps> = props => {
  const {
    item,
    nonameLabel,
    pendingConfirmationLabel,
    usedLabel,
    unusedLabel,
    devPubKeyLabel,
    dateAddedLabel,
    editable = false,
    onEditButtonClick,
    onDeleteButtonClick,
  } = props;

  if (!item) {
    return null;
  }

  return (
    <Stack
      spacing="gap-y-2"
      customStyle={`relative p-4 bg-(${!editable ? 'grey9 dark:grey3' : 'none'}) rounded-[1.25rem]`}
    >
      {/* key name section */}
      <Stack align="center" justify="between">
        <Stack align="center" spacing="gap-x-2">
          <Text weight="bold">{item?.name?.length ? item?.name : nonameLabel}</Text>

          <Stack
            customStyle={`w-2 h-2 rounded-full bg-(${
              item?.usedAt ? 'success' : 'warningLight dark: warningDark'
            })`}
          />

          {pendingConfirmationLabel && <Text>{pendingConfirmationLabel}</Text>}

          {!pendingConfirmationLabel && <Text>{item?.usedAt ? usedLabel : unusedLabel}</Text>}
        </Stack>
        {editable && (
          <Stack spacing="gap-x-8" align="center">
            {/* date added section - editable card */}
            <Stack align="center" spacing="gap-x-2">
              <Text variant="button-sm" weight="bold" color={{ light: 'grey4', dark: 'grey7' }}>
                {dateAddedLabel}
              </Text>

              <Text>{dayjs(item?.addedAt).format('DD/MM/YYYY')}</Text>
            </Stack>

            {/* action buttons */}
            <Stack align="center" spacing="gap-x-4">
              <Button
                icon="PencilIcon"
                variant="primary"
                iconOnly={true}
                greyBg={true}
                onClick={onEditButtonClick}
              />

              <Button
                icon="TrashIcon"
                variant="primary"
                iconOnly={true}
                greyBg={true}
                onClick={onDeleteButtonClick}
              />
            </Stack>
          </Stack>
        )}
      </Stack>

      {/* dev public key section */}
      <Stack>
        {editable ? (
          <Text variant="button-sm" weight="bold" color={{ light: 'grey4', dark: 'grey7' }}>
            {devPubKeyLabel}
          </Text>
        ) : (
          <Text variant="h6" weight="bold">
            {devPubKeyLabel}
          </Text>
        )}

        <Text color={{ light: 'secondaryLight', dark: 'secondaryDark' }}>{item?.id}</Text>
      </Stack>

      {/* date added section - non-editable card */}
      {!editable && (
        <Stack>
          <Text variant="h6" weight="bold">
            {dateAddedLabel}
          </Text>

          <Text>{dayjs(item?.addedAt).format('DD/MM/YYYY')}</Text>
        </Stack>
      )}
    </Stack>
  );
};

export default DevKeyCard;

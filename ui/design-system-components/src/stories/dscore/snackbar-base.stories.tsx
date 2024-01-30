import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { CheckCircleIcon } from '@akashaorg/design-system-core/lib/components/Icon/hero-icons-outline';
import Snackbar, { SnackbarProps } from '@akashaorg/design-system-core/lib/components/Snackbar';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import { NotificationTypes } from '@akashaorg/typings/lib/ui';

const meta: Meta<SnackbarProps> = {
  title: 'DSCore/Bars/Snackbar',
  component: Snackbar,
};

export default meta;
type Story = StoryObj<SnackbarProps>;

const variants: SnackbarProps[] = [
  {
    title: 'Info Snackbar',
    type: NotificationTypes?.Info,
  },
  {
    title: 'Alert Snackbar',
    description: 'Some important information will appear here',
    type: NotificationTypes?.Alert,
    actionButtonLabel: 'OK',
  },
  {
    title: 'Success Alert Snackbar',
    description: 'Some important information will appear here',
    type: NotificationTypes?.Success,
    actionButtonLabel: 'OK',
  },
  {
    title: 'Caution Alert Snackbar',
    description: 'Some important information will appear here',
    type: NotificationTypes?.Caution,
    actionButtonLabel: 'OK',
  },
  {
    title: 'Success Info Snackbar',
    type: NotificationTypes?.Success,
    icon: <CheckCircleIcon />,
  },
];

export const SnackbarVariants: Story = {
  render: () => (
    <Stack direction="column" spacing="gap-y-2" customStyle="w-[50%]">
      {variants.map((variant, idx) => (
        <Snackbar
          key={idx}
          {...variant}
          handleButtonClick={() => ({})}
          handleDismiss={() => ({})}
        />
      ))}
    </Stack>
  ),
};

import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import Snackbar, { SnackbarProps } from '.';
import Stack from '../Stack';

const meta: Meta<SnackbarProps> = {
  title: 'Snackbars/Snackbar',
  component: Snackbar,
};

export default meta;
type Story = StoryObj<SnackbarProps>;

const variants: SnackbarProps[] = [
  {
    title: 'Info Snackbar',
    type: 'info',
  },
  {
    title: 'Alert Snackbar',
    description: 'Some important information will appear here',
    type: 'alert',
    actionButtonLabel: 'OK',
  },
  {
    title: 'Success Alert Snackbar',
    description: 'Some important information will appear here',
    type: 'success',
    actionButtonLabel: 'OK',
  },
  {
    title: 'Caution Alert Snackbar',
    description: 'Some important information will appear here',
    type: 'caution',
    actionButtonLabel: 'OK',
  },
  {
    title: 'Success Info Snackbar',
    type: 'success',
    iconType: 'CheckCircleIcon',
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

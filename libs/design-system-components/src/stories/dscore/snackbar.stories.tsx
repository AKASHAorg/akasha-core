import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { CheckCircleIcon } from '@akashaorg/design-system-core/lib/components/Icon/hero-icons-outline';
import Snackbar, { SnackbarProps } from '@akashaorg/design-system-core/lib/components/Snackbar';
import { NotificationTypes } from '@akashaorg/typings/lib/ui';

const meta: Meta<SnackbarProps> = {
  title: 'DSCore/Bars/Snackbar',
  component: Snackbar,
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text' },
    type: {
      control: 'select',
      options: [
        NotificationTypes.Alert,
        NotificationTypes.Caution,
        NotificationTypes.Error,
        NotificationTypes.Info,
        NotificationTypes.Success,
      ],
    },
    icon: { control: 'object' },
    description: { control: 'text' },
    ctaLabel: { control: 'text' },
    customStyle: { control: 'text' },
    handleCTAClick: { action: 'button clicked' },
    handleDismiss: { action: 'dismissed' },
  },
};

type Story = StoryObj<SnackbarProps>;

const baseArgs: Story = {
  args: {
    title: 'Snackbar',
    description: 'Some important information will appear here',
  },
};

export const Default: Story = { args: { ...baseArgs.args } };

export const AlertSnackbar: Story = { args: { ...baseArgs.args, type: NotificationTypes.Alert } };

export const CautionSnackbar: Story = {
  args: { ...baseArgs.args, type: NotificationTypes.Caution },
};

export const ErrorSnackbar: Story = { args: { ...baseArgs.args, type: NotificationTypes.Error } };

export const InfoSnackbar: Story = { args: { ...baseArgs.args, type: NotificationTypes.Info } };

export const SuccessSnackbar: Story = {
  args: { ...baseArgs.args, type: NotificationTypes.Success },
};

export const SnackbarWithCTALabel: Story = {
  args: { ...baseArgs.args, ctaLabel: 'Dismiss' },
};

export const SnackbarWithSpecificCTALabelColor: Story = {
  args: {
    ...baseArgs.args,
    type: NotificationTypes.Error,
    ctaLabel: 'Dismiss',
    accentColor: true,
  },
};

export const SnackbarWithSpecificIcon: Story = {
  args: { ...baseArgs.args, icon: <CheckCircleIcon /> },
};

export default meta;

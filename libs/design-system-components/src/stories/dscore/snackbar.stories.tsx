import type { Meta, StoryObj } from '@storybook/react';
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
        NotificationTypes.Info,
        NotificationTypes.Caution,
        NotificationTypes.Success,
        NotificationTypes.Error,
      ],
    },
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

export const CautionSnackbar: Story = {
  args: { ...baseArgs.args, type: NotificationTypes.Caution },
};

export const SuccessSnackbar: Story = {
  args: { ...baseArgs.args, type: NotificationTypes.Success },
};

export const ErrorSnackbar: Story = { args: { ...baseArgs.args, type: NotificationTypes.Error } };

export const SnackbarWithCTALabel: Story = {
  args: { ...baseArgs.args, ctaLabel: 'Dismiss' },
};

export default meta;

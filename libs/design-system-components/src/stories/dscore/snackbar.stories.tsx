import type { Meta, StoryObj } from '@storybook/react';
import Snackbar, { SnackbarProps } from '@akashaorg/design-system-core/lib/components/Snackbar';
import { NotificationTypes } from '@akashaorg/typings/lib/ui';

Snackbar.displayName = 'Snackbar';

const meta: Meta<SnackbarProps> = {
  title: 'DSCore/Bars/Snackbar',
  component: Snackbar,
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

export const Default: Story = {
  args: { title: 'Snackbar', description: 'Some important information will appear here' },
};

export const CautionSnackbar: Story = {
  args: {
    title: 'Snackbar',
    description: 'Some important information will appear here',
    type: NotificationTypes.Caution,
  },
};

export const SuccessSnackbar: Story = {
  args: {
    title: 'Snackbar',
    description: 'Some important information will appear here',
    type: NotificationTypes.Success,
  },
};

export const ErrorSnackbar: Story = {
  args: {
    title: 'Snackbar',
    description: 'Some important information will appear here',
    type: NotificationTypes.Error,
  },
};

export const NonDismissableSnackbar: Story = {
  args: {
    title: 'Snackbar',
    description: 'Some important information will appear here',
    dismissable: false,
  },
};

export const SnackbarWithCTALabel: Story = {
  args: {
    title: 'Snackbar',
    description: 'Some important information will appear here',
    ctaLabel: 'Dismiss',
  },
};

export default meta;

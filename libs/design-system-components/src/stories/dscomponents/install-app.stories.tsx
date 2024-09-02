import type { Meta, StoryObj } from '@storybook/react';
import InstallApps, { InstallAppProps } from '../../components/InstallApp';

const meta: Meta<InstallAppProps> = {
  title: 'DSComponents/Extensions/AppInstallation',
  component: InstallApps,
};

type Story = StoryObj<InstallAppProps>;

export const InstallationInProgress: Story = {
  args: {
    title: 'Installation in progress',
    appName: 'Direct Messaging',
    progressInfo: 'Saving application information...',
    status: 'in-progress',
    action: { label: 'Cancel installation', onClick: () => ({}) },
  },
};

export const InstallationError: Story = {
  args: {
    title: 'Installation error',
    appName: 'Direct Messaging',
    progressInfo:
      'Something went wrong while installing the app, please check your network and try again!',
    status: 'error',
    action: { label: 'Dismiss', onClick: () => ({}) },
  },
};

export const InstallationCompleted: Story = {
  args: {
    title: 'Installation completed',
    appName: 'Direct Messaging',
    progressInfo: 'Installation Completed!',
    status: 'complete',
    action: { label: 'Open the Application', onClick: () => ({}) },
  },
};

export default meta;

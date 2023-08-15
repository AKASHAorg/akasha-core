import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import InstallApps, { InstallAppProps } from '.';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';

const meta: Meta<InstallAppProps> = {
  title: 'AkashaVerse/Install App',
  component: InstallApps,
};

export default meta;
type Story = StoryObj<InstallAppProps>;

const variants: InstallAppProps[] = [
  {
    title: 'Installation in progress',
    appName: 'Direct Messaging',
    progressInfo: 'Saving application information...',
    status: 'in-progress',
    action: { label: 'Cancel installation', onClick: () => ({}) },
  },
  {
    title: 'Installation error',
    appName: 'Direct Messaging',
    progressInfo:
      'Something went wrong while installing the app, please check your network and try again!',
    status: 'error',
    action: { label: 'Dismiss', onClick: () => ({}) },
  },
  {
    title: 'Installation completed',
    appName: 'Direct Messaging',
    progressInfo: 'Installation Completed!',
    status: 'complete',
    action: { label: 'Open the Application', onClick: () => ({}) },
  },
];

export const InstallAppsSteps: Story = {
  render: () => (
    <Stack direction="column" spacing="gap-y-2" customStyle="w-[35%]">
      {variants.map((variant, idx) => (
        <InstallApps key={idx} {...variant} />
      ))}
    </Stack>
  ),
};

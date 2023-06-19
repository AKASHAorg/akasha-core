import React from 'react';
import InstallApp, { InstallAppProps } from '.';

export default {
  title: 'AkashaVerse/Install App',
  component: InstallApp,
};

const Template = (args: InstallAppProps) => <InstallApp {...args} />;

export const InProgress = Template.bind({});

InProgress.args = {
  title: 'Installation in progress',
  appName: 'Direct Messaging',
  progressInfo: 'Saving install information...',
  status: 'in-progress',
  action: { label: 'Cancel installation', onClick: () => ({}) },
};

export const Error = Template.bind({});

Error.args = {
  title: 'Installation in progress',
  appName: 'Direct Messaging',
  progressInfo:
    'Something went wrong while installing the app, please check your network and try again!',
  status: 'error',
  action: { label: 'Dismiss', onClick: () => ({}) },
};

export const Complete = Template.bind({});

Complete.args = {
  title: 'Installation in progress',
  appName: 'Direct Messaging',
  progressInfo: 'Installation Completed!',
  status: 'complete',
  action: { label: 'Open the Application', onClick: () => ({}) },
};

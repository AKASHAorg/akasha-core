import React from 'react';
import AppList, { AppListProp } from '.';
import Button from '@akashaorg/design-system-core/lib/components/Button';

export default {
  title: 'AkashaVerse/AppList',
  component: AppList,
  argTypes: {},
};

const Template = (args: AppListProp) => <AppList {...args} />;

export const BaseAppList = Template.bind({});

BaseAppList.args = {
  apps: [
    {
      name: 'Supercarts',
      description:
        'Play with your friends in AKASHA World and enjoy a couple of puzzle games or drawing games or any kind of game!',
      action: <Button label="Install" variant="primary" />,
    },
    {
      name: 'Articles App',
      description:
        'Read articles written by AKASHA community you can also write your own articles or collaborate with other authors!',
      action: <Button label="Install" variant="primary" />,
    },
  ],
};

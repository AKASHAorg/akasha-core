import React from 'react';
import DevInfo, { DevInfoProps } from '.';
import Button from '@akashaorg/design-system-core/lib/components/Button';

const profileId = '0x003410490050000320006570034567114572000';
const avatar = { default: 'https://placebeard.it/360x360' };

export default {
  title: 'AkashaVerse/DevInfo',
  component: DevInfo,
};

const Template = (args: DevInfoProps) => <DevInfo {...args} />;

export const BaseDevInfo = Template.bind({});

BaseDevInfo.args = {
  developers: [{ profileId, avatar, name: 'Coffee Lover', userName: '@ilovecoffee' }],
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
  developerTitle: 'Developer',
};

import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import Button from '@akashaorg/design-system-core/lib/components/Button';

import DevInfo, { DevInfoProps } from '../../components/DevInfo';

const meta: Meta<DevInfoProps> = {
  title: 'DSComponents/AkashaVerse/DevInfo',
  component: DevInfo,
};

export default meta;
type Story = StoryObj<DevInfoProps>;

const profileId = '0x003410490050000320006570034567114572000';

const avatar = { default: { src: 'https://placebeard.it/360x360', height: 360, width: 360 } };

export const BaseDevInfo: Story = {
  render: () => (
    <DevInfo
      developers={[{ profileId, avatar, name: 'Coffee Lover' }]}
      apps={[
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
      ]}
      developerTitle="Developer"
      onAppSelected={() => ({})}
    />
  ),
};

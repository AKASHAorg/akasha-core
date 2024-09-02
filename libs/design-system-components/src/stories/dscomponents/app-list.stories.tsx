import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import AppList, { AppListProps } from '../../components/AppList';

const meta: Meta<AppListProps> = {
  title: 'DSComponents/Extensions/AppList',
  component: AppList,
};

type Story = StoryObj<AppListProps>;

export const Default: Story = {
  args: {
    apps: [
      {
        name: 'Supercarts',
        description:
          'Play with your friends in AKASHA World and enjoy a couple of puzzle games or drawing games or any kind of game!',
        action: <Button label="Install" variant="primary" />,
        logoImage: { src: 'https://placebeard.it/360x360', height: 360, width: 360 },
      },
      {
        name: 'Articles App',
        description:
          'Read articles written by AKASHA community you can also write your own articles or collaborate with other authors!',
        action: <Button label="Install" variant="primary" />,
        logoImage: { src: 'https://placebeard.it/360x360', height: 360, width: 360 },
      },
    ],
    onLoadMore: () => Promise.resolve({}),
  },
};

export default meta;

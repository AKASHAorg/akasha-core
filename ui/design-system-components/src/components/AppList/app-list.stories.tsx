import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import Button from '@akashaorg/design-system-core/lib/components/Button';
import Box from '@akashaorg/design-system-core/lib/components/Box';

import AppList, { AppListProps } from '.';

const meta: Meta<AppListProps> = {
  title: 'DSComponents/AkashaVerse/AppList',
  component: AppList,
};

export default meta;
type Story = StoryObj<AppListProps>;

export const BaseAppList: Story = {
  render: () => (
    <Box customStyle="w-[50%]">
      <AppList
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
        onAppSelected={() => ({})}
      />
    </Box>
  ),
};

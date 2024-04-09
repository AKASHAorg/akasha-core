import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import AppList, { AppListProps } from '../../components/AppList';

const Wrapped: React.FC<AppListProps> = props => (
  <Stack customStyle="w-[50%]">
    <AppList {...props} />
  </Stack>
);

const meta: Meta<AppListProps> = {
  title: 'DSComponents/Extensions/AppList',
  component: Wrapped,
  tags: ['autodocs'],
  argTypes: {
    apps: { control: 'object' },
    onAppSelected: { action: 'app selected' },
  },
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
      },
      {
        name: 'Articles App',
        description:
          'Read articles written by AKASHA community you can also write your own articles or collaborate with other authors!',
        action: <Button label="Install" variant="primary" />,
      },
    ],
  },
};

export default meta;

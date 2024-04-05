import type { Meta, StoryObj } from '@storybook/react';

import Avatar, { AvatarProps } from '@akashaorg/design-system-core/lib/components/Avatar';

const meta: Meta<AvatarProps> = {
  title: 'DSCore/Avatars/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  argTypes: {
    profileId: { crontrol: 'text' },
    active: { control: 'boolean' },
    faded: { control: 'boolean' },
  },
};

type Story = StoryObj<AvatarProps>;

const profileId = 'did:pkh:eip155:5:0x36c703c4d22af437dc883e2e0884e57404e16493';

const avatar = { src: 'https://placebeard.it/360x360', height: 360, width: 360 };

const baseArgs: Story = {
  args: {
    profileId,
    avatar,
  },
};

export const Default: Story = {
  args: { ...baseArgs.args },
};

export const ActiveAvatar: Story = {
  args: { ...baseArgs.args, active: true },
};

export const FadedAvatar: Story = {
  args: { ...baseArgs.args, faded: true },
};

export const AvatarWithBorderColor: Story = {
  args: { ...baseArgs.args, border: 'sm', borderColor: 'darkerBlue' },
};

export const AvatarWithSpecifiedSize: Story = {
  args: { ...baseArgs.args, size: 'xl' },
};

export default meta;

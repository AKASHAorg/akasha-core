import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import Avatar, { AvatarProps } from '@akashaorg/design-system-core/lib/components/Avatar';

const meta: Meta<AvatarProps> = {
  title: 'DSCore/Avatars/Avatar',
  component: Avatar,
};

export default meta;
type Story = StoryObj<AvatarProps>;

const ethAddress = '0x003410490050000320006570034567114572000';

const avatar = { src: 'https://placebeard.it/360x360', height: 360, width: 360 };

export const BaseAvatar: Story = {
  render: () => <Avatar profileId={ethAddress} avatar={avatar} />,
};

export const ActiveAvatar: Story = {
  render: () => <Avatar profileId={ethAddress} avatar={avatar} active={true} />,
};

export const FadedAvatar: Story = {
  render: () => <Avatar profileId={ethAddress} avatar={avatar} faded={true} />,
};

export const AvatarWithBorderColor: Story = {
  render: () => (
    <Avatar profileId={ethAddress} avatar={avatar} border="sm" borderColor="darkerBlue" />
  ),
};

export const AvatarWithSpecifiedSize: Story = {
  render: () => <Avatar profileId={ethAddress} avatar={avatar} size="xl" />,
};

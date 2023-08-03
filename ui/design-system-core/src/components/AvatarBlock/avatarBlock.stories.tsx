import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import AvatarBlock, { AvatarBlockProps } from '.';

const meta: Meta<AvatarBlockProps> = {
  title: 'Avatars/AvatarBlock',
  component: AvatarBlock,
};

export default meta;
type Story = StoryObj<AvatarBlockProps>;

const ethAddress = '0x003410490050000320006570034567114572000';

const avatar = { default: { src: 'https://placebeard.it/360x360', height: 360, width: 360 } };

export const BaseAvatarBlock: Story = {
  render: () => (
    <AvatarBlock
      profileId={ethAddress}
      avatar={avatar}
      name="Coffee Lover"
      userName="@coffeeLover"
    />
  ),
};

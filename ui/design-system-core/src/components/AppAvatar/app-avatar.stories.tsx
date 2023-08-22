import React from 'react';
import { tw } from '@twind/core';
import type { Meta, StoryObj } from '@storybook/react';
import { IntegrationTypes } from '@akashaorg/typings/ui';

import AppAvatar, { AppAvatarProps } from '.';

const meta: Meta<AppAvatarProps> = {
  title: 'Avatars/AppAvatar',
  component: AppAvatar,
};

export default meta;
type Story = StoryObj<AppAvatarProps>;

const ethAddress = '0x003410490050000320006570034567114572000';

const avatar = { default: { src: 'https://placebeard.it/360x360', height: 360, width: 360 } };

export const AvatarWithAppPlaceholder: Story = {
  render: () => (
    <div className={tw('w-fit')}>
      <AppAvatar appType={IntegrationTypes.APP} profileId={ethAddress} avatar={avatar} />
    </div>
  ),
};

export const AvatarWithWidgetPlaceholder: Story = {
  render: () => (
    <div className={tw('w-[15%]')}>
      <AppAvatar appType={IntegrationTypes.WIDGET} profileId={ethAddress} avatar={avatar} />
    </div>
  ),
};

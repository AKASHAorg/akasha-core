import React from 'react';
import { tw } from '@twind/core';
import type { Meta, StoryObj } from '@storybook/react';
import { IntegrationTypes } from '@akashaorg/typings/ui';

import AppAvatar from '.';

const meta: Meta<typeof AppAvatar> = {
  title: 'Avatars/AppAvatar',
  component: AppAvatar,
};

export default meta;
type Story = StoryObj<typeof AppAvatar>;

const ethAddress = '0x003410490050000320006570034567114572000';

export const AvatarWithAppPlaceholder: Story = {
  render: () => (
    <div className={tw('w-fit')}>
      <AppAvatar
        appType={IntegrationTypes.APP}
        profileId={ethAddress}
        avatar={{ default: { src: 'https://placebeard.it/360x360', height: 360, width: 360 } }}
      />
    </div>
  ),
};

export const AvatarWithWidgetPlaceholder: Story = {
  render: () => (
    <div className={tw('w-[15%]')}>
      <AppAvatar
        appType={IntegrationTypes.WIDGET}
        profileId={ethAddress}
        avatar={{ default: { src: 'https://placebeard.it/360x360', height: 360, width: 360 } }}
      />
    </div>
  ),
};

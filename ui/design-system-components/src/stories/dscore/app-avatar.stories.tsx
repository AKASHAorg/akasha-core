import type { Meta, StoryObj } from '@storybook/react';

import { IntegrationTypes } from '@akashaorg/typings/lib/ui';

import AppAvatar, { AppAvatarProps } from '@akashaorg/design-system-core/lib/components/AppAvatar';

const meta: Meta<AppAvatarProps> = {
  title: 'DSCore/Avatars/AppAvatar',
  component: AppAvatar,
  tags: ['autodocs'],
  argTypes: {
    appType: {
      options: [IntegrationTypes.APP, IntegrationTypes.WIDGET],
      control: { type: 'select' },
    },
  },
};

type Story = StoryObj<AppAvatarProps>;

const profileId = 'did:pkh:eip155:5:0x36c703c42dfa2437dc883e2e0884e57404e16493';

const avatar = { src: 'https://placebeard.it/360x360', height: 360, width: 360 };

export default meta;

const baseArgs: Story = {
  args: {
    appType: IntegrationTypes.APP,
    profileId: profileId,
    avatar,
  },
};

export const AvatarWithAppPlaceholder: Story = {
  args: {
    ...baseArgs.args,
  },
};

export const AvatarWithWidgetPlaceholder: Story = {
  args: {
    ...baseArgs.args,
    appType: IntegrationTypes.WIDGET,
  },
};

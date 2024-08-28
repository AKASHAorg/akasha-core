import type { Meta, StoryObj } from '@storybook/react';
import { AkashaAppApplicationType } from '@akashaorg/typings/lib/sdk/graphql-types-new';
import AppAvatar, { AppAvatarProps } from '@akashaorg/design-system-core/lib/components/AppAvatar';

const meta: Meta<AppAvatarProps> = {
  title: 'DSCore/Avatars/AppAvatar',
  component: AppAvatar,

  argTypes: {
    appType: {
      options: [
        AkashaAppApplicationType.App,
        AkashaAppApplicationType.Widget,
        AkashaAppApplicationType.Plugin,
        AkashaAppApplicationType.Other,
      ],
      control: { type: 'select' },
    },
  },
};

type Story = StoryObj<AppAvatarProps>;

export const AvatarWithAppPlaceholder: Story = {
  args: {
    avatar: { src: 'https://placebeard.it/360x360', height: 360, width: 360 },
    appType: AkashaAppApplicationType.App,
  },
};

export const AvatarWithWidgetPlaceholder: Story = {
  args: {
    avatar: { src: 'https://placebeard.it/360x360', height: 360, width: 360 },
    appType: AkashaAppApplicationType.Widget,
  },
};

export default meta;

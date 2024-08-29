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

const avatar = { src: 'https://placebeard.it/360x360', height: 360, width: 360 };

export const AvatarWithAppPlaceholder: Story = {
  args: {
    avatar,
    appType: AkashaAppApplicationType.App,
  },
};

export const AvatarWithWidgetPlaceholder: Story = {
  args: {
    avatar,
    appType: AkashaAppApplicationType.Widget,
  },
};

export default meta;

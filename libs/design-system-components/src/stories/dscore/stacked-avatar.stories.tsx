import type { Meta, StoryObj } from '@storybook/react';
import StackedAvatar, {
  StackedAvatarProps,
} from '@akashaorg/design-system-core/lib/components/StackedAvatar';
import { userData } from '@akashaorg/design-system-core/lib/utils';

StackedAvatar.displayName = 'StackedAvatar';

const meta: Meta<StackedAvatarProps> = {
  title: 'DSCore/Avatars/StackedAvatar',
  component: StackedAvatar,
  argTypes: {
    userData: { crontrol: 'object' },
    maxAvatars: { control: 'number' },
    size: { control: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'] },
  },
};

type Story = StoryObj<StackedAvatarProps>;

export const Default: Story = {
  args: {
    userData: userData.map(item => ({ ...item, avatar: item.avatar?.default })),
    maxAvatars: 4,
  },
};

export const StackedAvatarWithSize: Story = {
  args: {
    userData: userData.map(item => ({ ...item, avatar: item.avatar?.default })),
    maxAvatars: 4,
    size: 'xl',
  },
};

export default meta;

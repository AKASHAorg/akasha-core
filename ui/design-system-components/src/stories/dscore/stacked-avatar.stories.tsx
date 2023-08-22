import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import StackedAvatar, {
  StackedAvatarProps,
} from '@akashaorg/design-system-core/lib/components/StackedAvatar';

import { userData } from '@akashaorg/design-system-core/lib/utils';

const meta: Meta<StackedAvatarProps> = {
  title: 'DSCore/Avatars/StackedAvatar',
  component: StackedAvatar,
};

export default meta;
type Story = StoryObj<StackedAvatarProps>;

const variants: StackedAvatarProps[] = [
  {
    userData: userData,
    maxAvatars: 4, // slices this number from user data and renders the corresponding avatars
  },
  {
    userData: userData,
    maxAvatars: 4,
    size: 'xl',
  },
];

export const StackedAvatarVariants: Story = {
  render: () => (
    <Stack direction="column" spacing="gap-y-4">
      {variants.map((variant, idx) => (
        <StackedAvatar key={idx} {...variant} />
      ))}
    </Stack>
  ),
};

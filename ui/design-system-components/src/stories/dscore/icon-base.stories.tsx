import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import Icon, { IconProps } from '@akashaorg/design-system-core/lib/components/Icon';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import { CustomIconTypes } from '@akashaorg/design-system-core/src/components/Icon/akasha-icons';

const meta: Meta<IconProps> = {
  title: 'DSCore/Icons/Icon',
  component: Icon,
};

export default meta;
type Story = StoryObj<IconProps>;

const customIcons: CustomIconTypes[] = [
  'akasha',
  'discord',
  'github',
  'telegram',
  'twitter',
  'widget',
];

const variants: IconProps[] = [
  {
    type: 'akasha',
    size: 'xs',
  },
  {
    type: 'akasha',
    size: 'sm',
  },
  {
    type: 'akasha',
  },
  {
    type: 'akasha',
    size: 'lg',
  },
];

export const CustomIcons: Story = {
  render: () => (
    <Stack spacing="gap-x-2">
      {customIcons.map(icon => (
        <Icon key={icon} type={icon} color="white" />
      ))}
    </Stack>
  ),
};

export const IconVariants: Story = {
  render: () => (
    <Stack spacing="gap-x-2">
      {variants.map((variant, idx) => (
        <Icon key={idx} {...variant} color="white" />
      ))}
    </Stack>
  ),
};

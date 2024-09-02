import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Icon, { IconProps } from '@akashaorg/design-system-core/lib/components/Icon';
import { Akasha } from '@akashaorg/design-system-core/lib/components/Icon/akasha-icons';

Icon.displayName = 'Icon';

const meta: Meta<IconProps> = {
  title: 'DSCore/Icons/Icon',
  component: Icon,
  argTypes: {
    color: { control: 'text' },
    icon: { control: 'object' },
    size: { control: 'text' },
    breakPointSize: { control: 'text' },
    accentColor: { control: 'boolean' },
    disabled: { control: 'boolean' },
    hover: { control: 'boolean' },
    customStyle: { control: 'text' },
    hoverColor: { control: 'object' },
    solid: { control: 'boolean' },
    rotateAnimation: { control: 'boolean' },
  },
};

type Story = StoryObj<IconProps>;

export const Default: Story = { args: { icon: <Akasha />, solid: true } };

export const IconWithSize: Story = { args: { icon: <Akasha />, solid: true, size: 'xl' } };

export default meta;

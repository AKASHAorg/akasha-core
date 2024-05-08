import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Icon, { IconProps } from '@akashaorg/design-system-core/lib/components/Icon';
import { Akasha } from '@akashaorg/design-system-core/lib/components/Icon/akasha-icons';

const meta: Meta<IconProps> = {
  title: 'DSCore/Icons/Icon',
  component: Icon,
  tags: ['autodocs'],
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

const baseArgs: Story = {
  args: {
    icon: <Akasha />,
    solid: true,
  },
};

export const Default: Story = { args: { ...baseArgs.args } };

export const IconWithSize: Story = { args: { ...baseArgs.args, size: 'xl' } };

export default meta;

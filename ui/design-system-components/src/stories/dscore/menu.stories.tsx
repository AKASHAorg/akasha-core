import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import {
  EllipsisVerticalIcon,
  FlagIcon,
  LinkIcon,
} from '@akashaorg/design-system-core/lib/components/Icon/hero-icons-outline';
import Menu, { MenuProps } from '@akashaorg/design-system-core/lib/components/Menu';

const meta: Meta<MenuProps> = {
  title: 'DSCore/Menu/Menu',
  component: Menu,
  tags: ['autodocs'],
  argTypes: {
    anchor: { control: 'text' },
    disabled: { control: 'boolean' },
    items: { control: 'object' },
    showDivider: { control: 'boolean' },
    customStyle: { control: 'text' },
    onSelected: { action: 'menu selected' },
  },
};

type Story = StoryObj<MenuProps>;

const baseArgs: Story = {
  args: {
    anchor: {
      icon: <EllipsisVerticalIcon />,
      variant: 'primary',
      greyBg: true,
      iconOnly: true,
    },
    items: [
      {
        label: 'Copy',
        icon: <LinkIcon />,
        onClick: () => ({}),
      },
      {
        label: 'Flag',
        icon: <FlagIcon />,
        color: { light: 'errorLight', dark: 'errorDark' },
        onClick: () => ({}),
      },
    ],
  },
};

export const Default: Story = { args: { ...baseArgs.args } };

export const MenuDisabled: Story = { args: { ...baseArgs.args, disabled: true } };

export const MenuWithoutListDivider: Story = { args: { ...baseArgs.args, showDivider: false } };

export default meta;

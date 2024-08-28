import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import {
  EllipsisVerticalIcon,
  FlagIcon,
  LinkIcon,
} from '@akashaorg/design-system-core/lib/components/Icon/hero-icons-outline';
import Menu, { MenuProps } from '@akashaorg/design-system-core/lib/components/Menu';

EllipsisVerticalIcon.displayName = 'EllipsisVerticalIcon';
FlagIcon.displayName = 'FlagIcon';
LinkIcon.displayName = 'LinkIcon';

const meta: Meta<MenuProps> = {
  title: 'DSCore/Menu/Menu',
  component: Menu,

  argTypes: {
    anchor: {
      icon: { control: 'object' },
      variant: { control: 'text' },
      greyBg: { control: 'boolean' },
      iconOnly: { control: 'boolean' },
    },
    disabled: { control: 'boolean' },
    items: { control: 'object' },
    showDivider: { control: 'boolean' },
    customStyle: { control: 'text' },
    onSelected: { action: 'menu selected' },
  },
};

type Story = StoryObj<MenuProps>;

export const Default: Story = {
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

export const MenuDisabled: Story = {
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
    disabled: true,
  },
};

export const MenuWithoutListDivider: Story = {
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
    showDivider: false,
  },
};

export default meta;

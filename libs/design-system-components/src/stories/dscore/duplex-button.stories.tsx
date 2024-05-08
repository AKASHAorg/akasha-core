import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import DuplexButton, {
  DuplexButtonProps,
} from '@akashaorg/design-system-core/lib/components/DuplexButton';
import {
  CheckIcon,
  XMarkIcon,
} from '@akashaorg/design-system-core/lib/components/Icon/hero-icons-outline';

const meta: Meta<DuplexButtonProps> = {
  title: 'DSCore/Buttons/DuplexButton',
  component: DuplexButton,
  tags: ['autodocs'],
  argTypes: {
    inactiveLabel: { control: 'text' },
    inactiveVariant: { control: 'text' },
    activeLabel: { control: 'text' },
    activeVariant: { control: 'text' },
    activeHoverLabel: { control: 'text' },
    active: { control: 'boolean' },
    activeIcon: { control: 'object' },
    activeHoverIcon: { control: 'object' },
    allowMinimization: { control: 'boolean' },
    fixedWidth: { control: 'text' },
    onClickActive: { action: 'active state clicked' },
    onClickInactive: { action: 'inactive state clicked' },
  },
};

type Story = StoryObj<DuplexButtonProps>;

export const baseArgs: Story = {
  args: {
    inactiveLabel: 'Follow',
    activeLabel: 'Following',
    activeHoverLabel: 'Unfollow',
    active: true,
    activeVariant: 'secondary',
    inactiveVariant: 'secondary',
    hoverColors: {
      background: { light: 'transparent', dark: 'transparent' },
      border: { light: 'errorLight', dark: 'errorDark' },
      text: { light: 'errorLight', dark: 'errorDark' },
      icon: { light: 'errorLight', dark: 'errorDark' },
    },
  },
};

export const Default: Story = { args: { ...baseArgs.args } };

export const InactiveButton: Story = { args: { ...baseArgs.args, active: false } };

export const DuplexButtonWithIcon: Story = {
  args: {
    ...baseArgs.args,
    iconDirection: 'left',
    activeIcon: <CheckIcon />,
    activeHoverIcon: <XMarkIcon />,
  },
};

export default meta;

import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import DuplexButton, {
  DuplexButtonProps,
} from '@akashaorg/design-system-core/lib/components/DuplexButton';
import {
  CheckIcon,
  XMarkIcon,
} from '@akashaorg/design-system-core/lib/components/Icon/hero-icons-outline';

DuplexButton.displayName = 'DuplexButton';

const meta: Meta<DuplexButtonProps> = {
  title: 'DSCore/Buttons/DuplexButton',
  component: DuplexButton,
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

export const Default: Story = {
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

export const InactiveButton: Story = {
  args: {
    inactiveLabel: 'Follow',
    activeLabel: 'Following',
    activeHoverLabel: 'Unfollow',
    active: false,
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

export const DuplexButtonWithIcon: Story = {
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
    iconDirection: 'left',
    activeIcon: <CheckIcon />,
    activeHoverIcon: <XMarkIcon />,
  },
};

export default meta;

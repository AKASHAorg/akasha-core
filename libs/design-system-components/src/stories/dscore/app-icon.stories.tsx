import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import AppIcon, { AppIconProps } from '@akashaorg/design-system-core/lib/components/AppIcon';
import { Akasha } from '@akashaorg/design-system-core/lib/components/Icon/akasha-icons';

const meta: Meta<AppIconProps> = {
  title: 'DSCore/Icons/AppIcon',
  component: AppIcon,
  tags: ['autodocs'],
  argTypes: {
    placeholderIcon: { control: 'object' },
    solid: { control: 'boolean' },
    accentColor: { control: 'boolean' },
    stackedIcon: { control: 'boolean' },
    hasNewNotifs: { control: 'boolean' },
    size: { control: 'text' },
    breakPointSize: { control: 'text' },
    hover: { control: 'boolean' },
    active: { control: 'boolean' },
    iconColor: { control: 'object' },
    background: { control: 'object' },
    backgroundSize: { control: 'number' },
    radius: { control: 'text' },
    customStyle: { control: 'text' },
  },
};

type Story = StoryObj<AppIconProps>;

export const Default: Story = {
  args: { placeholderIcon: <Akasha />, solid: true },
};

export const AppIconWithNotification: Story = {
  args: { placeholderIcon: <Akasha />, solid: true, hasNewNotifs: true },
};

export const AppIconWithSpecificSize: Story = {
  args: { placeholderIcon: <Akasha />, solid: true, size: 'xl' },
};

export const AppIconCustomColored: Story = {
  args: {
    placeholderIcon: <Akasha />,
    solid: true,
    iconColor: 'white',
    background: 'secondaryDark',
  },
};

export const AppIconStacked: Story = {
  args: { placeholderIcon: <Akasha />, solid: true, stackedIcon: true },
};

export default meta;

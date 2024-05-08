import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  MoonIcon,
  SunIcon,
} from '@akashaorg/design-system-core/lib/components/Icon/hero-icons-outline';
import Toggle, { ToggleProps } from '@akashaorg/design-system-core/lib/components/Toggle';

const meta: Meta<ToggleProps> = {
  title: 'DSCore/Buttons/Toggle',
  component: Toggle,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    size: { control: 'select', options: ['small', 'large'] },
    checked: { control: 'boolean' },
    disabled: { control: 'boolean' },
    onChange: { action: 'toggled' },
  },
};

type Story = StoryObj<ToggleProps>;

const baseArgs: Story = {
  args: {
    label: 'toggle',
    size: 'small',
  },
};

export const Default: Story = {
  args: { ...baseArgs.args },
};

export const ToggleChecked: Story = {
  args: { ...baseArgs.args, checked: true },
};

export const ToggleWithIcons: Story = {
  args: { ...baseArgs.args, iconChecked: <SunIcon />, iconUnchecked: <MoonIcon /> },
};

export const ToggleWithIconsChecked: Story = {
  args: { ...baseArgs.args, checked: true, iconChecked: <SunIcon />, iconUnchecked: <MoonIcon /> },
};

export const ToggleDisabled: Story = {
  args: { ...baseArgs.args, disabled: true },
};

export default meta;

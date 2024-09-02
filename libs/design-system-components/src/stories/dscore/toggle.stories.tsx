import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  MoonIcon,
  SunIcon,
} from '@akashaorg/design-system-core/lib/components/Icon/hero-icons-outline';
import Toggle, { ToggleProps } from '@akashaorg/design-system-core/lib/components/Toggle';

Toggle.displayName = 'Toggle';

const meta: Meta<ToggleProps> = {
  title: 'DSCore/Buttons/Toggle',
  component: Toggle,
  argTypes: {
    label: { control: 'text' },
    size: { control: 'select', options: ['small', 'large'] },
    checked: { control: 'boolean' },
    disabled: { control: 'boolean' },
    onChange: { action: 'toggled' },
  },
};

type Story = StoryObj<ToggleProps>;

export const Default: Story = {
  args: { label: 'toggle', size: 'small' },
};

export const ToggleChecked: Story = {
  args: { label: 'toggle', size: 'small', checked: true },
};

export const ToggleWithIcons: Story = {
  args: { label: 'toggle', size: 'small', iconChecked: <SunIcon />, iconUnchecked: <MoonIcon /> },
};

export const ToggleWithIconsChecked: Story = {
  args: {
    label: 'toggle',
    size: 'small',
    checked: true,
    iconChecked: <SunIcon />,
    iconUnchecked: <MoonIcon />,
  },
};

export const ToggleDisabled: Story = {
  args: { label: 'toggle', size: 'small', disabled: true },
};

export default meta;

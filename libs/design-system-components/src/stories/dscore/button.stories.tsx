import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import {
  CheckIcon,
  PlusIcon,
} from '@akashaorg/design-system-core/lib/components/Icon/hero-icons-outline';
import { ButtonProps } from '@akashaorg/design-system-core/lib/components/Button/types';

Button.displayName = 'Button';

const meta: Meta<ButtonProps> = {
  title: 'DSCore/Buttons/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    size: { options: ['xs', 'sm', 'md', 'lg'], control: { type: 'select' } },
    variant: { options: ['primary', 'secondary'], control: { type: 'select' } },
    active: { control: 'boolean' },
    greyBg: { control: 'boolean' },
    loading: { control: 'boolean' },
    disabled: { control: 'boolean' },
    iconDirection: { options: ['left', 'right'], control: { type: 'select' } },
    onClick: { action: 'button clicked' },
  },
};

type Story = StoryObj<ButtonProps>;

export default meta;

export const BaseButton: Story = {
  args: {
    label: 'Button',
    size: 'sm',
    variant: 'primary',
  },
};
export const IconOnlyButton: Story = {
  args: { label: 'Button', variant: 'primary', icon: <PlusIcon />, size: 'xs' },
};

export const ButtonWithIcon: Story = {
  args: {
    label: 'Button',
    size: 'sm',
    variant: 'primary',
    icon: <PlusIcon />,
    iconDirection: 'left',
  },
};

export const ButtonActive: Story = {
  args: {
    label: 'Button',
    size: 'sm',
    variant: 'primary',
    active: true,
    icon: <CheckIcon />,
    iconDirection: 'right',
  },
};

export const ButtonGreyBg: Story = {
  args: { label: 'Button', size: 'sm', variant: 'primary', greyBg: true },
};

export const ButtonLoading: Story = {
  args: { label: 'Button', size: 'sm', variant: 'primary', loading: true },
};

export const ButtonDisabled: Story = {
  args: { label: 'Button', size: 'sm', variant: 'primary', disabled: true },
};

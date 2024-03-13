import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import {
  CheckIcon,
  PlusIcon,
} from '@akashaorg/design-system-core/lib/components/Icon/hero-icons-outline';
import { ButtonProps } from '@akashaorg/design-system-core/lib/components/Button/types';

const meta: Meta<ButtonProps> = {
  title: 'DSCore/Buttons/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    label: { controls: 'text' },
    size: { options: ['xs', 'sm', 'md', 'lg'], control: { type: 'select' } },
    variant: { options: ['primary', 'secondary'], control: { type: 'select' } },
    active: { controls: 'boolean' },
    greyBg: { controls: 'boolean' },
    loading: { controls: 'boolean' },
    disabled: { controls: 'boolean' },
    iconDirection: { options: ['left', 'right'], control: { type: 'select' } },
    onClick: { action: 'button clicked' },
  },
};

type Story = StoryObj<ButtonProps>;

export default meta;

const baseArgs: Story = {
  args: { label: 'Button', size: 'sm', variant: 'primary' },
};

export const BaseButton: Story = {
  args: {
    ...baseArgs.args,
  },
};
export const IconOnlyButton: Story = { args: { ...baseArgs.args, icon: <PlusIcon />, size: 'xs' } };

export const ButtonWithIcon: Story = {
  args: { ...baseArgs.args, icon: <PlusIcon />, iconDirection: 'left' },
};

export const ButtonActive: Story = {
  args: { ...baseArgs.args, active: true, icon: <CheckIcon />, iconDirection: 'right' },
};

export const ButtonGreyBg: Story = {
  args: { ...baseArgs.args, greyBg: true },
};

export const ButtonLoading: Story = {
  args: { ...baseArgs.args, loading: true },
};

export const ButtonDisabled: Story = {
  args: { ...baseArgs.args, disabled: true },
};

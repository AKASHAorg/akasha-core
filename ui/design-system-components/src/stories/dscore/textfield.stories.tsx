import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { CheckCircleIcon } from '@akashaorg/design-system-core/lib/components/Icon/hero-icons-outline';
import TextField from '@akashaorg/design-system-core/lib/components/TextField';
import { TextFieldProps } from '@akashaorg/design-system-core/lib/components/TextField/types';

const meta: Meta = {
  title: 'DSCore/Fields/TextField',
  component: TextField,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    caption: { control: 'text' },
    placeholder: { control: 'text' },
    type: { control: 'select', options: ['text', 'multiline'] },
    status: { control: 'select', options: ['success', 'warning', 'error'] },
    disabled: { control: 'boolean' },
    onChange: { action: 'change handler' },
  },
};

type Story = StoryObj<TextFieldProps>;

const baseArgs: Story = {
  args: {
    type: 'text',
  },
};

export const Default: Story = {
  args: { ...baseArgs.args },
};

export const TextFieldMultiline: Story = {
  args: { type: 'multiline' },
};

export const TextFieldWithLabel: Story = {
  args: { ...baseArgs.args, label: 'Label' },
};

export const TextFieldWithCaption: Story = {
  args: { ...baseArgs.args, caption: 'some caption' },
};

export const TextFieldWithPlaceholder: Story = {
  args: { ...baseArgs.args, placeholder: "what's on your mind?..." },
};

export const TextFieldWithIcons: Story = {
  args: { ...baseArgs.args, iconLeft: <CheckCircleIcon />, iconRight: <CheckCircleIcon /> },
};

export const TextFieldSuccess: Story = {
  args: { ...baseArgs.args, status: 'success', caption: 'Success caption' },
};

export const TextFieldWarning: Story = {
  args: { ...baseArgs.args, status: 'warning', caption: 'Warning caption' },
};

export const TextFieldError: Story = {
  args: { ...baseArgs.args, status: 'error', caption: 'Error caption' },
};

export const TextFieldDisabled: Story = {
  args: { ...baseArgs.args, disabled: true },
};

export default meta;

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

export const Default: Story = {
  args: { type: 'text' },
};

export const TextFieldMultiline: Story = {
  args: { type: 'multiline' },
};

export const TextFieldWithLabel: Story = {
  args: { type: 'text', label: 'Label' },
};

export const RequiredTextFieldWithLabel: Story = {
  args: { type: 'text', label: 'Label', required: true },
};

export const RequiredTextFieldWithSpecificColor: Story = {
  args: {
    type: 'text',
    label: 'Label',
    required: true,
    requiredFieldAsteriskColor: { light: 'errorLight', dark: 'errorDark' },
  },
};

export const TextFieldWithCaption: Story = {
  args: { type: 'text', caption: 'some caption' },
};

export const TextFieldWithPlaceholder: Story = {
  args: { type: 'text', placeholder: "what's on your mind?..." },
};

export const TextFieldWithIcons: Story = {
  args: { type: 'text', iconLeft: <CheckCircleIcon />, iconRight: <CheckCircleIcon /> },
};

export const TextFieldSuccess: Story = {
  args: { type: 'text', status: 'success', caption: 'Success caption' },
};

export const TextFieldWarning: Story = {
  args: { type: 'text', status: 'warning', caption: 'Warning caption' },
};

export const TextFieldError: Story = {
  args: { type: 'text', status: 'error', caption: 'Error caption' },
};

export const ReadOnlyTextField: Story = {
  args: { type: 'text', readOnly: true },
};

export const TextFieldDisabled: Story = {
  args: { type: 'text', disabled: true },
};

export default meta;

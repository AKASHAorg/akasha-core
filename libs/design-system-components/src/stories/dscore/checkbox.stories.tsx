import type { Meta, StoryObj } from '@storybook/react';

import Checkbox, { CheckboxProps } from '@akashaorg/design-system-core/lib/components/Checkbox';

const meta: Meta<CheckboxProps> = {
  title: 'DSCore/Buttons/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  argTypes: {
    id: { control: 'text' },
    label: { control: 'text' },
    labelDirection: { control: 'select', options: ['left', 'right'] },
    labelColor: { control: 'text' },
    value: { control: 'text' },
    name: { control: 'text' },
    size: { control: 'text' },
    indeterminate: { control: 'boolean' },
    error: { control: 'boolean' },
    isSelected: { control: 'boolean' },
    isDisabled: { control: 'boolean' },
    customStyle: { control: 'text' },
    handleChange: { action: 'checkbox changed' },
  },
};

type Story = StoryObj<CheckboxProps>;

const baseArgs: Story = {
  args: {
    label: 'Checkbox',
    name: 'checkbox',
    value: 'Checkbox',
    isSelected: false,
  },
};

export const Default: Story = { args: { ...baseArgs.args } };

export const CheckboxSelected: Story = { args: { ...baseArgs.args, isSelected: true } };

export const CheckboxWithError: Story = { args: { ...baseArgs.args, error: true } };

export const CheckboxDisabled: Story = { args: { ...baseArgs.args, isDisabled: true } };

export const CheckboxIndeterminate: Story = { args: { ...baseArgs.args, indeterminate: true } };

export default meta;

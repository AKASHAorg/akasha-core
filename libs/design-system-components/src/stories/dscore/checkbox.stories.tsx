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

export const Default: Story = {
  args: { label: 'Checkbox', name: 'checkbox', value: 'Checkbox', isSelected: false },
};

export const CheckboxSelected: Story = {
  args: {
    label: 'Checkbox',
    name: 'checkbox',
    value: 'Checkbox',
    isSelected: true,
  },
};

export const CheckboxWithError: Story = {
  args: { label: 'Checkbox', name: 'checkbox', value: 'Checkbox', isSelected: false, error: true },
};

export const CheckboxDisabled: Story = {
  args: {
    label: 'Checkbox',
    name: 'checkbox',
    value: 'Checkbox',
    isSelected: false,
    isDisabled: true,
  },
};

export const CheckboxIndeterminate: Story = {
  args: {
    label: 'Checkbox',
    name: 'checkbox',
    value: 'Checkbox',
    isSelected: false,
    indeterminate: true,
  },
};

export default meta;

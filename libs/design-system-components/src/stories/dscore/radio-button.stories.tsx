import type { Meta, StoryObj } from '@storybook/react';
import RadioButton, {
  RadioButtonProps,
} from '@akashaorg/design-system-core/lib/components/RadioButton';

const meta: Meta<RadioButtonProps> = {
  title: 'DSCore/Buttons/RadioButton',
  component: RadioButton,
  tags: ['autodocs'],
  argTypes: {
    id: { control: 'text' },
    label: { control: 'text' },
    value: { control: 'text' },
    size: { control: 'select', options: ['small', 'large'] },
    isSelected: { control: 'boolean' },
    error: { control: 'boolean' },
    handleChange: { action: 'radio button checked' },
  },
};

type Story = StoryObj<RadioButtonProps>;

const baseArgs: Story = {
  args: {
    id: '1',
    label: 'Radio button',
    value: 'Radio button',
  },
};

export const Default: Story = { args: { ...baseArgs.args } };

export const RadioButtonSelected: Story = { args: { ...baseArgs.args, isSelected: true } };

export const RadioButtonError: Story = { args: { ...baseArgs.args, error: true } };

export const RadioButtonLarge: Story = { args: { ...baseArgs.args, size: 'large' } };

export default meta;

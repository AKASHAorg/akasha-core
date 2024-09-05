import type { Meta, StoryObj } from '@storybook/react';
import RadioButton, {
  RadioButtonProps,
} from '@akashaorg/design-system-core/lib/components/RadioButton';

RadioButton.displayName = 'RadioButton';

const meta: Meta<RadioButtonProps> = {
  title: 'DSCore/Buttons/RadioButton',
  component: RadioButton,
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

export const Default: Story = { args: { id: '1', label: 'Radio button', value: 'Radio button' } };

export const RadioButtonSelected: Story = {
  args: { id: '1', label: 'Radio button', value: 'Radio button', isSelected: true },
};

export const RadioButtonError: Story = {
  args: { id: '1', label: 'Radio button', value: 'Radio button', error: true },
};

export const RadioButtonLarge: Story = {
  args: { id: '1', label: 'Radio button', value: 'Radio button', size: 'large' },
};

export default meta;

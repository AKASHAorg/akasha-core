import type { Meta, StoryObj } from '@storybook/react';
import Stepper, { StepperProps } from '@akashaorg/design-system-core/lib/components/Stepper';

const meta: Meta<StepperProps> = {
  title: 'DSComponents/Steppers/Stepper',
  component: Stepper,
  tags: ['autodocs'],
  argTypes: {
    length: { control: 'number' },
    currentStep: { control: 'number' },
  },
};

type Story = StoryObj<StepperProps>;

export const Default: Story = { args: { length: 5, currentStep: 3 } };

export default meta;

import type { Meta, StoryObj } from '@storybook/react';
import Spinner, { SpinnerProps } from '@akashaorg/design-system-core/lib/components/Spinner';

Spinner.displayName = 'Spinner';

const meta: Meta<SpinnerProps> = {
  title: 'DSCore/Spinners/Spinner',
  component: Spinner,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'text', options: ['sm', 'md', 'lg', 'xl', 'xxl'] },
    loadingLabel: { control: 'text' },
    partialSpinner: { control: 'boolean' },
  },
};

type Story = StoryObj<SpinnerProps>;

const baseArgs: Story = {
  args: {
    size: 'sm',
  },
};

export const Default: Story = { args: { ...baseArgs.args } };

export const SpinnerWithLoadingLabel: Story = {
  args: { ...baseArgs.args, loadingLabel: 'loading...' },
};

export const SpinnerWithColor: Story = { args: { ...baseArgs.args, color: 'blue' } };

export const PartialSpinner: Story = { args: { ...baseArgs.args, partialSpinner: true } };

export default meta;

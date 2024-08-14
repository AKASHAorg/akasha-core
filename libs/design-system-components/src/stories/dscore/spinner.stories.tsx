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

export const Default: Story = { args: { size: 'sm' } };

export const SpinnerWithLoadingLabel: Story = {
  args: { size: 'sm', loadingLabel: 'loading...' },
};

export const SpinnerWithColor: Story = { args: { size: 'sm', color: 'blue' } };

export const PartialSpinner: Story = { args: { size: 'sm', partialSpinner: true } };

export default meta;

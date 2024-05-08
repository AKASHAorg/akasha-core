import type { Meta, StoryObj } from '@storybook/react';
import OnboardingStartCard, {
  OnboardingStartCardProps,
} from '../../components/OnboardingStartCard';

const meta: Meta<OnboardingStartCardProps> = {
  title: 'DSComponents/Cards/OnboardingStartCard',
  component: OnboardingStartCard,
  tags: ['autodocs'],
  argTypes: {
    inputPlaceholderLabel: { control: 'text' },
    titleLabel: { control: 'text' },
    handleSearch: { action: 'searched' },
  },
};

type Story = StoryObj<OnboardingStartCardProps>;

const baseArgs: Story = {
  args: {
    inputPlaceholderLabel: 'Search',
    titleLabel: 'Search',
    buttonLabel: 'Search',
    handleSearch: () => ({}),
  },
};

export const Default: Story = {
  args: { ...baseArgs.args },
};

export const ButtonDisabled: Story = {
  args: {
    ...baseArgs.args,
    isButtonEnabled: false,
  },
};

export default meta;

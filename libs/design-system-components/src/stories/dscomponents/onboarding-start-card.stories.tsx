import type { Meta, StoryObj } from '@storybook/react';
import OnboardingStartCard, {
  OnboardingStartCardProps,
} from '../../components/OnboardingStartCard';

const meta: Meta<OnboardingStartCardProps> = {
  title: 'DSComponents/Cards/OnboardingStartCard',
  component: OnboardingStartCard,
};

type Story = StoryObj<OnboardingStartCardProps>;

export const Default: Story = {
  args: {
    inputPlaceholderLabel: 'Search',
    titleLabel: 'Search',
    buttonLabel: 'Search',
    handleSearch: () => ({}),
  },
};

export const ButtonDisabled: Story = {
  args: {
    inputPlaceholderLabel: 'Search',
    titleLabel: 'Search',
    buttonLabel: 'Search',
    handleSearch: () => ({}),
    isButtonEnabled: false,
  },
};

export default meta;

import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import OnboardingStartCard, { OnboardingStartCardProps } from '.';

const meta: Meta<OnboardingStartCardProps> = {
  title: 'Cards/OnboardingStartCard',
  component: OnboardingStartCard,
};

export default meta;
type Story = StoryObj<OnboardingStartCardProps>;

export const BaseOnboardingStartCard: Story = {
  render: () => (
    <OnboardingStartCard
      inputPlaceholderLabel="Search"
      titleLabel="Search"
      handleSearch={() => ({})}
    />
  ),
};

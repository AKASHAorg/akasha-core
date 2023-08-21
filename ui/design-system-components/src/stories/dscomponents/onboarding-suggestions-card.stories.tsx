import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import OnboardingSuggestionsCard, {
  OnboardingSuggestionsCardProps,
} from '../../components/OnboardingSuggestionsCard';

const meta: Meta<OnboardingSuggestionsCardProps> = {
  title: 'DSComponents/Cards/OnboardingSuggestionsCard',
  component: OnboardingSuggestionsCard,
};

export default meta;
type Story = StoryObj<OnboardingSuggestionsCardProps>;

export const BaseOnboardingSuggestionsCard: Story = {
  render: () => (
    <OnboardingSuggestionsCard topicsLabel="TOPICS TO FOLLOW" peopleLabel="PEOPLE TO FOLLOW" />
  ),
};

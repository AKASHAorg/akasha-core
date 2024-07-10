import type { Meta, StoryObj } from '@storybook/react';
import OnboardingSuggestionsCard, {
  OnboardingSuggestionsCardProps,
} from '../../components/OnboardingSuggestionsCard';

const meta: Meta<OnboardingSuggestionsCardProps> = {
  title: 'DSComponents/Cards/OnboardingSuggestionsCard',
  component: OnboardingSuggestionsCard,
  tags: ['autodocs'],
};

type Story = StoryObj<OnboardingSuggestionsCardProps>;

export const BaseOnboardingSuggestionsCard: Story = {
  args: {
    topicsLabel: 'TOPICS TO FOLLOW',
    peopleLabel: 'PEOPLE TO FOLLOW',
    transformSource: () => ({
      src: 'https://placebeard.it/360x360',
      width: 360,
      height: 360,
    }),
  },
};

export default meta;

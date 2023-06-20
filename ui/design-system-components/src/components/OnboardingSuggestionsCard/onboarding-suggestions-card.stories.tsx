import React from 'react';

import { OnboardingSuggestionsCard, OnboardingSuggestionsCardProps } from './index';

export default {
  title: 'Cards/OnboardingSuggestionsCard',
  component: OnboardingSuggestionsCard,
  argTypes: {
    title: { control: 'text' },
  },
};

const Template = (args: OnboardingSuggestionsCardProps) => {
  return <OnboardingSuggestionsCard {...args} />;
};

export const BaseOnboardingSuggestionsCard = Template.bind({});

BaseOnboardingSuggestionsCard.args = {
  topicsLabel: 'TOPICS TO FOLLOW',
  peopleLabel: 'PEOPLE TO FOLLOW',
};

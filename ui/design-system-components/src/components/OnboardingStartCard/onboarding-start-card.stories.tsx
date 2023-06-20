import React from 'react';

import { OnboardingStartCard, OnboardingStartCardProps } from './index';

export default {
  title: 'Cards/OnboardingStartCard',
  component: OnboardingStartCard,
  argTypes: {
    searchKeyword: { control: 'text' },
    inputPlaceholderLabel: { control: 'text' },
    title: { control: 'text' },
    description: { control: 'text' },
    image: { control: 'text' },
  },
};

const Template = (args: OnboardingStartCardProps) => {
  return <OnboardingStartCard {...args} />;
};

export const BaseOnboardingStartCard = Template.bind({});

BaseOnboardingStartCard.args = {
  inputPlaceholderLabel: 'Search',
  titleLabel: 'Search',
};

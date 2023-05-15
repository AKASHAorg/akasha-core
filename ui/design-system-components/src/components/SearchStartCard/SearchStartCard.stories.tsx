import React from 'react';

import { SearchStartCard, SearchStartProps } from './index';

export default {
  title: 'Cards/SearchStartCard',
  component: SearchStartCard,
  argTypes: {
    searchKeyword: { control: 'text' },
    inputPlaceholderLabel: { control: 'text' },
    title: { control: 'text' },
    description: { control: 'text' },
    image: { control: 'text' },
  },
};

const Template = (args: SearchStartProps) => {
  return (
    <div>
      <SearchStartCard {...args} />
    </div>
  );
};

export const BaseSearchStartCard = Template.bind({});

BaseSearchStartCard.args = {
  searchKeyword: '',
  inputPlaceholderLabel: 'Search',
  titleLabel: 'Search',
  subtitleLabel: '✨ Find what you’re looking for quickly ✨',
  description:
    'To create your unique feed view, subscribe to your favourite topics and find wonderful people to follow in our community.',
};

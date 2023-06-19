import React from 'react';

import StartCard, { StartProps } from './index';

export default {
  title: 'Cards/StartCard',
  component: StartCard,
  argTypes: {
    title: { control: 'text' },
    heading: { control: 'text' },
    description: { control: 'text' },
    image: { control: 'text' },
  },
};

const Template = (args: StartProps) => {
  return <StartCard {...args} />;
};

export const BaseStartCard = Template.bind({});

BaseStartCard.args = {
  title: 'Bookmarks',
  heading: '✨ Save what inspires you ✨',
  image: 'https://placekitten.com/300/300',
  description:
    'To create your unique feed view, subscribe to your favourite topics and find wonderful people to follow in our community.',
};

import React from 'react';
import InfoCard, { InfoProps } from './index';

export default {
  title: 'Cards/InfoCard',
  component: InfoCard,
  argTypes: {
    icon: { control: 'text' },
    title: { control: 'text' },
    description: { control: 'text' },
    suggestion: { control: 'text' },
  },
};

const Template = (args: InfoProps) => {
  return (
    <div>
      <InfoCard {...args} />
    </div>
  );
};

export const BaseSubtitleTextIcon = Template.bind({});

BaseSubtitleTextIcon.args = {
  title: 'No matching results found',
  description: '',
  suggestion: 'Make sure you spelled everything correctly',
};

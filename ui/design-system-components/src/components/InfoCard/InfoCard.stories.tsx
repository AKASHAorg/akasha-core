import React from 'react';
import InfoCard, { InfoProps } from './index';

export default {
  title: 'Cards/InfoCard',
  component: InfoCard,
  argTypes: {
    preposition_in: { control: 'text' },
    keyword: { control: 'text' },
    explanation: { control: 'text' },
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
  preposition_in: 'in',
  explanation: 'No matching results found',
  keyword: 'test',
  suggestion: 'Make sure you spelled everything correctly',
};

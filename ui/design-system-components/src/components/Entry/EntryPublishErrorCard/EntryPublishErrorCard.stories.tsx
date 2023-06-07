import React from 'react';

import EntryPublishErrorCard, { PublishErrorCardProps } from '.';

export default {
  title: 'Errors/EntryPublishErrorCard',
  component: EntryPublishErrorCard,
  argTypes: {
    isCard: { control: 'boolean' },
  },
};

const Template = (args: PublishErrorCardProps) => <EntryPublishErrorCard {...args} />;

export const BaseEntryPublishErrorCard = Template.bind({});
BaseEntryPublishErrorCard.args = {
  isCard: true,
  message: 'Sorry, an error occured!',
};

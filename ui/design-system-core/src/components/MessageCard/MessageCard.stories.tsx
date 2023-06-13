import React from 'react';
import MessageCard from './index';

export default {
  title: 'Cards/MessageCard',
  component: MessageCard,
};

const Template = args => <MessageCard {...args} />;

export const BasicMessageCard = Template.bind({});
BasicMessageCard.args = {
  title: 'Title',
  message: 'A sample message ...',
  elevation: '1',
  onClose: () => ({}),
};

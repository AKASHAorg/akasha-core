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
  elevation: '1',
  children: 'A sample message ...',
  onClose: () => ({}),
};

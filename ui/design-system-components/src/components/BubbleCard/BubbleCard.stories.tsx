import React from 'react';

import BubbleCard, { IBubbleCardProps } from '.';

import { editorDefaultValue } from '../Editor/initialValue';

export default {
  title: 'Cards/BubbleCard',
  component: BubbleCard,
  argType: {
    senderName: { control: 'text' },
    youLabel: { control: 'text' },
    content: { control: 'text' },
    isLoggedUser: { control: 'boolean' },
    chatTimestamp: { control: 'text' },
  },
};

const Template = (args: IBubbleCardProps) => <BubbleCard {...args} />;

export const BaseBubbleCard = Template.bind({});

BaseBubbleCard.args = {
  locale: 'en',
  senderName: 'Jerry Mil',
  youLabel: 'You',
  content: editorDefaultValue,
  isLoggedUser: true,
  chatTimestamp: '2022-06-16T10:07:15.000Z',
};

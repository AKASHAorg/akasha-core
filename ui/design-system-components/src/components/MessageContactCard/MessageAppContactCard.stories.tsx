import React from 'react';

import MessageContactCard, { IMessageContactCardProps } from './index';

export default {
  title: 'Cards/MessageContactCard',
  component: MessageContactCard,
  argType: {
    senderName: { control: 'text' },
    senderUsername: { control: 'text' },
    content: { control: 'text' },
    isRead: { control: 'boolean' },
    isPinned: { control: 'boolean' },
    pinConvoLabel: { control: 'text' },
    unpinConvoLabel: { control: 'text' },
    senderAvatar: { control: 'text' },
    latestChatTimestamp: { control: 'text' },
    senderEthAddress: { control: 'text' },
    onClickAvatar: { action: 'mini card avatar clicked' },
    onClickCard: { action: 'mini card clicked' },
    onConvoPin: { action: 'convo pinned' },
  },
};

const Template = (args: IMessageContactCardProps) => <MessageContactCard {...args} />;

const ethAddress = '0x003410490050000320006570034567114572000';

export const BaseMessageContactCard = Template.bind({});

BaseMessageContactCard.args = {
  locale: 'en',
  senderName: 'Jerry Mil',
  senderUsername: 'jerrbear',
  content: "Hello Jerry, I hope you're good and having a great day?",
  isRead: true,
  isPinned: false,
  pinConvoLabel: 'Pin',
  unpinConvoLabel: 'Unpin',
  latestChatTimestamp: '2022-06-14T16:48:00.000Z',
  senderAvatar: { url: 'https://placebeard.it/360x360' },
  senderEthAddress: ethAddress,
};

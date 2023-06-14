import React from 'react';

import ChatList, { IChatListProps } from '.';
import BubbleCard from '../BubbleCard';

export default {
  title: 'Cards/ChatList',
  component: ChatList,
  argType: {
    emptyChatLabel: { control: 'text' },
    loggedUserEthAddress: { control: 'text' },
    onMentionClick: { action: 'clicked mention' },
    onTagClick: { action: 'clicked tag' },
    onLinkClick: { action: 'clicked link' },
  },
};

const Template = (args: IChatListProps) => <ChatList {...args} />;

const ethAddress = '0x003410490050000320006570034567114572000';

export const BaseChatList = Template.bind({});

BaseChatList.args = {
  emptyChatLabel: 'Start by saying hello! 👋🏼',
  loggedUserEthAddress: ethAddress,
  itemCard: <BubbleCard locale="en" youLabel="You" />,
  oldMessages: [],
};

import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import ChatList, { ChatListProps } from '.';
import BubbleCard from '../BubbleCard';

const meta: Meta<ChatListProps> = {
  title: 'Chat/ChatList',
  component: ChatList,
};

export default meta;
type Story = StoryObj<ChatListProps>;

export const BaseChatList: Story = {
  render: () => (
    <ChatList
      emptyChatLabel="Start by saying hello! 👋🏼"
      loggedUserProfileId="did:key:003410490050000320006570034567114572000"
      itemCard={<BubbleCard locale="en" youLabel="You" />}
      oldMessages={[]}
    />
  ),
};

import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import ChatList, { ChatListProps } from '../../components/ChatList';
import BubbleCard from '../../components/BubbleCard';

const meta: Meta<ChatListProps> = {
  title: 'DSComponents/Chat/ChatList',
  component: ChatList,
  tags: ['autodocs'],
  argTypes: {
    emptyChatLabel: { control: 'text' },
    loggedUserProfileId: { control: 'text' },
    itemCard: { control: 'object' },
    oldMessages: { control: 'object' },
  },
};

type Story = StoryObj<ChatListProps>;

export const Default: Story = {
  args: {
    emptyChatLabel: 'Start by saying hello! 👋🏼',
    loggedUserProfileId: 'did:key:003410490050000320006570034567114572000',
    itemCard: <BubbleCard locale="en" youLabel="You" />,
    oldMessages: [],
  },
};

export default meta;

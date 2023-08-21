import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import ChatAreaHeader, { ChatAreaHeaderProps } from '../../components/ChatAreaHeader';

const meta: Meta<ChatAreaHeaderProps> = {
  title: 'DSComponents/Chat/ChatAreaHeader',
  component: ChatAreaHeader,
};

export default meta;
type Story = StoryObj<ChatAreaHeaderProps>;

const avatar = { default: { src: 'https://placebeard.it/360x360', height: 360, width: 360 } };

export const BaseChatAreaHeader: Story = {
  render: () => (
    <ChatAreaHeader
      name="Estelle Collier"
      avatar={avatar}
      did={{ id: 'did:key:003410490050000320006570034567114572000' }}
    />
  ),
};

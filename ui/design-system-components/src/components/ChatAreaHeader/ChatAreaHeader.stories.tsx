import React from 'react';

import ChatAreaHeader, { IChatAreaHeaderProps } from '.';

export default {
  title: 'Cards/ChatAreaHeader',
  component: ChatAreaHeader,
  argType: {
    name: { control: 'text' },
    avatar: { control: 'text' },
    userName: { control: 'text' },
    ethAddress: { control: 'text' },
    onClickAvatar: { action: 'avatar clicked' },
  },
};

const Template = (args: IChatAreaHeaderProps) => <ChatAreaHeader {...args} />;

const ethAddress = '0x003410490050000320006570034567114572000';

export const BaseChatAreaHeader = Template.bind({});

BaseChatAreaHeader.args = {
  name: 'Estelle Collier',
  userName: 'estellecollier',
  avatar: { url: 'https://placebeard.it/360x360' },
  ethAddress: ethAddress,
};

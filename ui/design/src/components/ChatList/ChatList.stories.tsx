import React from 'react';
import { Box, Grommet } from 'grommet';

import ChatList, { IChatListProps } from '.';
import BubbleCard from '../BubbleCard';

import lightTheme from '../../styles/themes/light/light-theme';
import { dummyChatArr } from '../../utils/dummy-data';

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

const Template = (args: IChatListProps) => (
  <Grommet theme={lightTheme}>
    <Box width="42.5%" pad="none" align="center">
      <ChatList {...args} />
    </Box>
  </Grommet>
);

const ethAddress = '0x003410490050000320006570034567114572000';

export const BaseChatList = Template.bind({});

BaseChatList.args = {
  emptyChatLabel: 'Start by saying hello! 👋🏼',
  loggedUserEthAddress: ethAddress,
  itemCard: <BubbleCard locale="en" youLabel="You" />,
  chatArr: dummyChatArr,
};

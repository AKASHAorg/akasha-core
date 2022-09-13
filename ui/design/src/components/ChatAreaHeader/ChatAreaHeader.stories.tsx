import React from 'react';
import { Box, Grommet } from 'grommet';

import ChatAreaHeader, { IChatAreaHeaderProps } from '.';

import lightTheme from '../../styles/themes/light/light-theme';

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

const Template = (args: IChatAreaHeaderProps) => (
  <Grommet theme={lightTheme}>
    <Box width="42.5%" pad="none" align="center">
      <ChatAreaHeader {...args} />
    </Box>
  </Grommet>
);

const ethAddress = '0x003410490050000320006570034567114572000';

export const BaseChatAreaHeader = Template.bind({});

BaseChatAreaHeader.args = {
  name: 'Estelle Collier',
  userName: 'estellecollier',
  avatar: { url: 'https://placebeard.it/360x360' },
  ethAddress: ethAddress,
};

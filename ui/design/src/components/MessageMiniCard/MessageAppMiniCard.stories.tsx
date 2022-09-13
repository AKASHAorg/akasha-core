import React from 'react';
import { Box, Grommet } from 'grommet';

import MessageAppMiniCard, { IMessageAppMiniCardProps } from '.';

import lightTheme from '../../styles/themes/light/light-theme';

export default {
  title: 'Cards/MessageAppMiniCard',
  component: MessageAppMiniCard,
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

const Template = (args: IMessageAppMiniCardProps) => (
  <Grommet theme={lightTheme}>
    <Box width="42.5%" pad="none" align="center">
      <MessageAppMiniCard {...args} />
    </Box>
  </Grommet>
);

const ethAddress = '0x003410490050000320006570034567114572000';

export const BaseMessageAppMiniCard = Template.bind({});

BaseMessageAppMiniCard.args = {
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

import React from 'react';
import { Box, Grommet } from 'grommet';

import MessageAppBubbleCard, { IMessageAppBubbleCardProps } from '.';

import lightTheme from '../../styles/themes/light/light-theme';

export default {
  title: 'Cards/MessageAppBubbleCard',
  component: MessageAppBubbleCard,
  argType: {
    sender: { control: 'text' },
    youLabel: { control: 'text' },
    content: { control: 'text' },
    isLoggedUser: { control: 'boolean' },
    chatTimestamp: { control: 'text' },
  },
};

const Template = (args: IMessageAppBubbleCardProps) => (
  <Grommet theme={lightTheme}>
    <Box width="42.5%" pad="none" align="center">
      <MessageAppBubbleCard {...args} />
    </Box>
  </Grommet>
);

export const BaseMessageAppBubbleCard = Template.bind({});

BaseMessageAppBubbleCard.args = {
  locale: 'en',
  sender: 'Jerry Mil',
  youLabel: 'You',
  content:
    'Hello Estelle, how are you? I really like the article you shared about NFTs, do you have any experience in NFTs?',
  isLoggedUser: true,
  chatTimestamp: '2022-06-16T10:07:15.000Z',
};

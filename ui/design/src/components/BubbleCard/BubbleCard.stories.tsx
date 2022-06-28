import React from 'react';
import { Box, Grommet } from 'grommet';

import BubbleCard, { IBubbleCardProps } from '.';

import lightTheme from '../../styles/themes/light/light-theme';
import { entryData } from '../../utils/dummy-data';

export default {
  title: 'Cards/BubbleCard',
  component: BubbleCard,
  argType: {
    sender: { control: 'text' },
    youLabel: { control: 'text' },
    content: { control: 'text' },
    isLoggedUser: { control: 'boolean' },
    chatTimestamp: { control: 'text' },
  },
};

const Template = (args: IBubbleCardProps) => (
  <Grommet theme={lightTheme}>
    <Box width="42.5%" pad="none" align="center">
      <BubbleCard {...args} />
    </Box>
  </Grommet>
);

export const BaseBubbleCard = Template.bind({});

BaseBubbleCard.args = {
  locale: 'en',
  sender: 'Jerry Mil',
  youLabel: 'You',
  content: entryData.slateContent,
  isLoggedUser: true,
  chatTimestamp: '2022-06-16T10:07:15.000Z',
};

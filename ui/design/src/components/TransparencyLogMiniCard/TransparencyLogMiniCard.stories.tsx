import React from 'react';
import { Box, Grommet } from 'grommet';

import TransparencyLogMiniCard, { ITransparencyLogMiniCardProps } from '.';

import lightTheme from '../../styles/themes/light/light-theme';

export default {
  title: 'Cards/TransparencyLogMiniCard',
  component: TransparencyLogMiniCard,
  argType: {
    title: { control: 'text' },
    content: { control: 'text' },
    isSelected: { control: 'boolean' },
    isDelisted: { control: 'boolean' },
    moderatedTimestamp: { control: 'text' },
    moderatorAvatarUrl: { control: 'text' },
    moderatorEthAddress: { control: 'text' },
    onClickAvatar: { action: 'avatar clicked' },
    onClickCard: { action: 'card clicked' },
  },
};

const Template = (args: ITransparencyLogMiniCardProps) => (
  <Grommet theme={lightTheme}>
    <Box width="42.5%" pad="none" align="center">
      <TransparencyLogMiniCard {...args} />
    </Box>
  </Grommet>
);

const ethAddress = '0x003410490050000320006570034567114572000';

export const BaseTransparencyLogMiniCard = Template.bind({});

BaseTransparencyLogMiniCard.args = {
  locale: 'en',
  title: 'Post Delisted',
  content:
    'This post violates our Code of Conduct by being offensive and harmful to others. This person is directly threatening a group of people.',
  isSelected: true,
  isDelisted: true,
  moderatedTimestamp: '2021-06-14T16:48:00.000Z',
  moderatorAvatarUrl: 'https://placebeard.it/360x360',
  moderatorEthAddress: ethAddress,
};

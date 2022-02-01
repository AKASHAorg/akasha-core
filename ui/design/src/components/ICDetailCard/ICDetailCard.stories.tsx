import React from 'react';
import { Box, Grommet } from 'grommet';

import ICDetailCard, { ICDetailCardProps } from '.';

import lightTheme from '../../styles/themes/light/light-theme';
import { ICWorldAppsData } from '../../utils/dummy-data';

export default {
  title: 'Cards/ICDetailCard',
  component: ICDetailCard,
  argType: {},
};

const Template = (args: ICDetailCardProps) => (
  <Grommet theme={lightTheme}>
    <Box width="30%" pad="none" align="center">
      <ICDetailCard {...args} />
    </Box>
  </Grommet>
);

export const BaseICDetailCard = Template.bind({});

BaseICDetailCard.args = {
  titleLabel: ICWorldAppsData[3].name,
  shareLabel: 'Share',
  hash: ICWorldAppsData[3].hash,
  avatar: ICWorldAppsData[3].avatar,
  coverImage: ICWorldAppsData[3].coverImage,
  descriptionLabel: 'Description',
};

import React from 'react';
import { Box, Grommet } from 'grommet';

import ProfileSubCard, { IProfileSubCardProps } from '.';

import lightTheme from '../../styles/themes/light/light-theme';
import { ICWorldAppsData } from '../../utils/dummy-data';

export default {
  title: 'Cards/ProfileSubCard',
  component: ProfileSubCard,
  argType: {
    titleLabel: { control: 'text' },
    ctaLabel: { control: 'text' },
  },
};

const Template = (args: IProfileSubCardProps) => (
  <Grommet theme={lightTheme}>
    <Box align="center" width="50%" pad={{ top: '40px' }}>
      <ProfileSubCard {...args} />
    </Box>
  </Grommet>
);

export const BaseProfileSubCard = Template.bind({});

BaseProfileSubCard.args = {
  titleLabel: 'Published Apps',
  ctaLabel: 'See All',
  apps: ICWorldAppsData,
};

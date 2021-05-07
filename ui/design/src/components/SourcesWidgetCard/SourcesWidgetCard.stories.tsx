import React from 'react';
import { Box, Grommet } from 'grommet';

import SourcesWidgetCard from '.';

import lightTheme from '../../styles/themes/light/light-theme';

export default {
  title: 'Cards/SourcesWidgetCard',
  component: SourcesWidgetCard,
};

const Template = (args: any) => (
  <Grommet theme={lightTheme}>
    <Box width="30%" pad="none" align="center">
      <SourcesWidgetCard {...args} />
    </Box>
  </Grommet>
);

export const BaseSourcesWidgetCard = Template.bind({});

BaseSourcesWidgetCard.args = {
  titleLabel: 'My feed sources',
  tagsNumber: 15,
  profilesNumber: 35,
  appsNumber: 50,
};

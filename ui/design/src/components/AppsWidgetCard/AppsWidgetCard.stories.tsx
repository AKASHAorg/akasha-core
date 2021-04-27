import React from 'react';
import { Box, Grommet } from 'grommet';

import AppsWidgetCard from '.';

import lightTheme from '../../styles/themes/light/light-theme';
import { appsDataSource } from '../../utils/dummy-data';

export default {
  title: 'Cards/AppsWidgetCard',
  component: AppsWidgetCard,
  argTypes: {
    labelColor: { control: 'color' },
    label: { control: 'text' },
    iconType: { control: 'text' },
    margin: { margin: { control: 'text' } },
    onClick: { action: 'clicked' },
    onAppClick: { action: 'clicked app' },
  },
};

const Template = (args: any) => (
  <Grommet theme={lightTheme}>
    <Box width="30%" pad="none" align="center">
      <AppsWidgetCard {...args} />
    </Box>
  </Grommet>
);

const margin = { margin: '0px' };

export const BaseAppsWidgetCard = Template.bind({});

BaseAppsWidgetCard.args = {
  dataSource: appsDataSource,
  margin: margin,
  iconType: 'trendingApps',
  label: 'Trending Apps',
  labelColor: '#132540',
};

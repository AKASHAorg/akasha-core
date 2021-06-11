import React from 'react';
import { Box, Grommet } from 'grommet';

import TopicsWidgetCard, { ITopicsCardWidgetProps } from '.';

import lightTheme from '../../styles/themes/light/light-theme';
import { topicsDataSource } from '../../utils/dummy-data';

export default {
  title: 'Cards/TopicsWidgetCard',
  component: TopicsWidgetCard,
  argType: {
    label: { control: 'text' },
    labelColor: { control: 'color' },
    onClick: { action: 'clicked' },
    onTopicClick: { action: 'clicked topic' },
  },
};

const Template = (args: ITopicsCardWidgetProps) => (
  <Grommet theme={lightTheme}>
    <Box width="30%" pad="none" align="center">
      <TopicsWidgetCard {...args} />
    </Box>
  </Grommet>
);

const margin = { margin: '0px' };

export const BaseTopicsWidgetCard = Template.bind({});

BaseTopicsWidgetCard.args = {
  label: 'Hot Topics',
  labelColor: '#132540',
  iconType: 'hotTopics',
  margin: margin,
  dataSource: topicsDataSource,
};

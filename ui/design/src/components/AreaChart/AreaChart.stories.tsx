import React from 'react';
import { Box, Grommet } from 'grommet';

import AreaChart, { IAreaChart } from '.';

import lightTheme from '../../styles/themes/light/light-theme';
import { chartData } from '../../utils/dummy-data';

export default {
  title: 'Charts/AreaChart',
  component: AreaChart,
};

const Template = (args: IAreaChart) => (
  <Grommet theme={lightTheme}>
    <Box fill={true} justify="center" align="center">
      <Box width="medium" pad={{ top: '120px' }}>
        <AreaChart {...args} />
      </Box>
    </Box>
  </Grommet>
);

const margin = { top: 10, bottom: 10, left: 10, right: 10 };

export const BaseAreaChart = Template.bind({});
BaseAreaChart.args = {
  data: chartData,
  height: 85,
  width: 320,
  margin: margin,
};

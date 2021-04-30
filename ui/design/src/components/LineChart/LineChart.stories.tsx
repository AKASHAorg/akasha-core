import React from 'react';
import { Box, Grommet } from 'grommet';

import LineChart, { ILineChart } from '.';

import lightTheme from '../../styles/themes/light/light-theme';
import { chartData } from '../../utils/dummy-data';

export default {
  title: 'Charts/LineChart',
  component: LineChart,
};

const Template = (args: ILineChart) => (
  <Grommet theme={lightTheme}>
    <Box fill={true} justify="center" align="center">
      <Box width="medium" pad={{ top: '120px' }}>
        <LineChart {...args} />
      </Box>
    </Box>
  </Grommet>
);

const margin = { top: 16, bottom: 16, left: 40, right: 16 };

export const BaseLineChart = Template.bind({});
BaseLineChart.args = {
  data: chartData,
  height: 165,
  width: 580,
  margin: margin,
};

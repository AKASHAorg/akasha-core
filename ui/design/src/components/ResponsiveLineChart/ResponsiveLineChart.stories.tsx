import React from 'react';
import { Box, Grommet } from 'grommet';

import ResponsiveLineChart from '.';

import { IMentionData } from '../AreaChart';
import lightTheme from '../../styles/themes/light/light-theme';
import { chartData } from '../../utils/dummy-data';

export default {
  title: 'Charts/ResponsiveLineChart',
  component: ResponsiveLineChart,
};

const Template = (args: { data: IMentionData[] }) => (
  <Grommet theme={lightTheme}>
    <Box fill={true} justify="center" align="center">
      <Box width="medium" pad={{ top: '120px' }}>
        <ResponsiveLineChart {...args} />
      </Box>
    </Box>
  </Grommet>
);

export const BaseResponsiveLineChart = Template.bind({});
BaseResponsiveLineChart.args = {
  data: chartData,
};

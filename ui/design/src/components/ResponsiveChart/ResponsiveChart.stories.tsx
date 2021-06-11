import React from 'react';
import { Box, Grommet } from 'grommet';

import ResponsiveChart from '.';

import { IMentionData } from '../AreaChart';
import lightTheme from '../../styles/themes/light/light-theme';
import { chartData } from '../../utils/dummy-data';

export default {
  title: 'Charts/ResponsiveChart',
  component: ResponsiveChart,
};

const Template = (args: { data: IMentionData[] }) => (
  <Grommet theme={lightTheme}>
    <Box fill={true} justify="center" align="center">
      <Box width="medium" pad={{ top: '120px' }}>
        <ResponsiveChart {...args} />
      </Box>
    </Box>
  </Grommet>
);

export const BaseResponsiveChart = Template.bind({});
BaseResponsiveChart.args = {
  data: chartData,
};

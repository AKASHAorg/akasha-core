/* eslint-disable import/first */
import DS from '@akashaproject/design-system';
import { storiesOf } from '@storybook/react';
import * as React from 'react';

const { Box, AreaChart, LineChart } = DS;

export const chartData = [
  { mentions: Math.floor(Math.random() * 100), date: 1590994625 },
  { mentions: Math.floor(Math.random() * 10), date: 1591081025 },
  { mentions: Math.floor(Math.random() * 100), date: 1591167425 },
  { mentions: Math.floor(Math.random() * 300), date: 1591253825 },
  { mentions: Math.floor(Math.random() * 280), date: 1591340225 },
  { mentions: Math.floor(Math.random() * 120), date: 1591426625 },
  { mentions: Math.floor(Math.random() * 120), date: 1591513025 },
];

const AreaChartComponent = () => {
  return (
    <Box fill={true} justify="center" align="center">
      <Box width="medium" pad={{ top: '120px' }}>
        <AreaChart
          data={chartData}
          height={85}
          width={320}
          margin={{ top: 10, bottom: 10, left: 10, right: 10 }}
        />
      </Box>
    </Box>
  );
};

const LineChartComponent = () => {
  return (
    <Box fill={true} justify="center" align="center">
      <Box width="medium" pad={{ top: '120px' }}>
        <LineChart
          data={chartData}
          height={165}
          width={580}
          margin={{ top: 16, bottom: 16, left: 40, right: 16 }}
        />
      </Box>
    </Box>
  );
};

storiesOf('Charts/Popularity over time', module)
  .add('area chart', () => <AreaChartComponent />)
  .add('line chart', () => <LineChartComponent />);

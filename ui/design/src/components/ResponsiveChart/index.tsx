import * as React from 'react';
import AreaChart, { IMentionData } from '../AreaChart';
import { ParentSize } from '@vx/responsive';

const ResponsiveChart: React.FC<{ data: IMentionData[] }> = props => (
  <ParentSize>
    {({ width, height }) => (
      <AreaChart
        width={width}
        height={height}
        data={props.data}
        margin={{ top: 10, bottom: 10, left: 10, right: 10 }}
      />
    )}
  </ParentSize>
);

export default ResponsiveChart;

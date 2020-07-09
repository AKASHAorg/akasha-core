import * as React from 'react';
import { IMentionData } from './area-chart';
import { LineChart } from './line-chart';
import { ParentSize } from '@vx/responsive';

const ResponsiveLineChart: React.FC<{ data: IMentionData[] }> = props => (
  <ParentSize>
    {({ width, height }) => (
      <LineChart
        width={width}
        height={height}
        data={props.data}
        margin={{ top: 0, bottom: 0, left: 40, right: 0 }}
      />
    )}
  </ParentSize>
);

export { ResponsiveLineChart };

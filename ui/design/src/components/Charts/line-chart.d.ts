import * as React from 'react';
import { IMentionData } from './area-chart';
export interface ILineChart {
  data: IMentionData[];
  width: number;
  height: number;
  margin: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
}
declare const LineChart: React.FC<ILineChart>;
export { LineChart };

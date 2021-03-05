import * as React from 'react';
export interface IAreaChart {
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
export interface IMentionData {
  mentions: number;
  date: number;
}
declare const AreaChart: React.FC<IAreaChart>;
export { AreaChart };

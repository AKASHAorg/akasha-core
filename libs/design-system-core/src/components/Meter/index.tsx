import React, { PropsWithChildren } from 'react';

import Bar from './Bar';
import Circle from './Circle';

import { Color } from '../types/common.types';

export type MeterProps = PropsWithChildren<{
  size: number;
  thickness: number;
  value: number;
  max?: number;
  progressBg?: Color;
  background?: Color;
  type?: 'circle' | 'bar';
  direction?: 'horizontal' | 'vertical';
  customStyle?: string;
}>;

/**
 * A Meter component enables you to include a meter in the shape of a bar or circle in your
 * app quickly.
 * @param size - number which is the size of the meter
 * @param thickness - number which is the thickness of the stroke
 * @param value - number which is the current count. We will compare this number with 100 or
 * the `max` prop when updating the meter
 * @param max - number (optional) the max to compare with
 * @param progressBg - (optional) customize the color of the progress bar
 * @param background - (optional) customize the background color
 * @param type - (optional) specify whether it is a bar type or circle type
 * @param direction - (optional)
 * @param customStyle - (optional) apply your custom styling (Make sure to use standard Tailwind classes)
 * @example
 * ```tsx
 *     <Meter size={400} thickness={5} value={60} type="bar" />
 * ```
 **/
const Meter: React.FC<MeterProps> = ({ type = 'circle', direction, children, ...rest }) => {
  if (type === 'circle') return <Circle {...rest}>{children}</Circle>;

  return (
    <Bar direction={direction} {...rest}>
      {children}
    </Bar>
  );
};

export default Meter;

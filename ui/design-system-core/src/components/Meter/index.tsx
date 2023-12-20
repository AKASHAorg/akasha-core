import React, { PropsWithChildren } from 'react';

import Bar from './bar';
import Circle from './circle';

import { Color } from '../types/common.types';

export type MeterProps = {
  size: number;
  thickness: number;
  value: number;
  max?: number;
  progressBg?: Color;
  background?: Color;
  type?: 'circle' | 'bar';
  direction?: 'horizontal' | 'vertical';
  customStyle?: string;
};

const Meter: React.FC<PropsWithChildren<MeterProps>> = ({
  type = 'circle',
  direction,
  children,
  ...rest
}) => {
  if (type === 'circle') return <Circle {...rest}>{children}</Circle>;

  return (
    <Bar direction={direction} {...rest}>
      {children}
    </Bar>
  );
};

export default Meter;

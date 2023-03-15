import React from 'react';
import Circle from './Circle';
import { PropsWithChildren } from 'react';
import { MeterProps } from './types';
import Bar from './Bar';

const Meter: React.FC<
  PropsWithChildren<MeterProps & { type?: 'circle' | 'bar'; direction?: 'horizontal' | 'vertical' }>
> = ({ type = 'circle', direction, children, ...rest }) => {
  if (type === 'circle') return <Circle {...rest}>{children}</Circle>;

  return (
    <Bar direction={direction} {...rest}>
      {children}
    </Bar>
  );
};

export default Meter;

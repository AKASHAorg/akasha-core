import React, { PropsWithChildren } from 'react';
import { apply, tw } from '@twind/core';

export type BoxProps = {
  customStyle?: string;
  testId?: string;
  style?: React.CSSProperties;
} & Omit<
  React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
  'className'
>;

const Box: React.FC<PropsWithChildren<BoxProps>> = React.forwardRef((props, ref) => {
  const { customStyle = '', style = {}, testId, children, ...rest } = props;

  return (
    <div className={tw(customStyle)} data-testid={testId} {...rest} style={style} ref={ref}>
      {children}
    </div>
  );
});

export default Box;

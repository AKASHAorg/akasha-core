import React, { PropsWithChildren } from 'react';
import { apply, tw } from '@twind/core';

export interface IBoxProps {
  customStyle?: string;
  testId?: string;
  style?: React.CSSProperties;
}

const Box: React.FC<
  PropsWithChildren<
    IBoxProps & React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>
  >
> = props => {
  const { customStyle = '', style = {}, testId, children, ...rest } = props;

  const className = apply`${customStyle}`;

  return (
    <div className={tw(className)} data-testid={testId} {...rest} style={style}>
      {children}
    </div>
  );
};

export default Box;

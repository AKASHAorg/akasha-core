import React, { PropsWithChildren } from 'react';
import { apply, tw } from '@twind/core';

export type BoxProps = {
  customStyle?: string;
  testId?: string;
} & Omit<React.HTMLAttributes<HTMLDivElement>, 'className'>;

const Box: React.FC<PropsWithChildren<BoxProps>> = props => {
  const { customStyle = '', testId, children, ...rest } = props;

  const className = apply`${customStyle}`;

  return (
    <div className={tw(className)} data-testid={testId} {...rest}>
      {children}
    </div>
  );
};

export default Box;

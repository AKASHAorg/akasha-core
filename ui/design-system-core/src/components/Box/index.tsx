import React, { PropsWithChildren } from 'react';
import { apply, tw } from '@twind/core';

export type BoxProps = {
  customStyle?: string;
} & Omit<React.HTMLAttributes<HTMLDivElement>, 'className'>;

const Box: React.FC<PropsWithChildren<BoxProps>> = props => {
  const { customStyle = '', children, ...other } = props;

  const className = apply`${customStyle}`;

  return (
    <div className={tw(className)} {...other}>
      {children}
    </div>
  );
};

export default Box;

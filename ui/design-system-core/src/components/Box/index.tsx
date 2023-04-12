import React, { PropsWithChildren } from 'react';
import { apply, tw } from '@twind/core';

export interface IBoxProps {
  customStyle?: string;
}

const Box: React.FC<PropsWithChildren<IBoxProps>> = props => {
  const { customStyle = '', children } = props;

  const className = apply`${customStyle}`;

  return <div className={tw(className)}>{children}</div>;
};

export default Box;

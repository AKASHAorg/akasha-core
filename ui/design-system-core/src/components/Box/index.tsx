import React, { PropsWithChildren } from 'react';
import { tw } from '@twind/core';

export interface IBoxProps {
  customStyle?: string;
}

const Box: React.FC<PropsWithChildren<IBoxProps>> = props => {
  const { customStyle = '', children } = props;

  return <div className={tw(customStyle)}>{children}</div>;
};

export default Box;

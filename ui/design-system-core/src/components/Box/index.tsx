import React, { PropsWithChildren } from 'react';
import { tw } from '@twind/core';

export interface IBoxProps {
  style?: string;
}

const Box: React.FC<PropsWithChildren<IBoxProps>> = props => {
  const { style = '', children } = props;

  return <div className={tw(style)}>{children}</div>;
};

export default Box;

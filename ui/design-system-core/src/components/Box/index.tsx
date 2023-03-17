import React, { PropsWithChildren } from 'react';
import { apply, tw } from '@twind/core';

export interface IBoxProps {
  customStyle?: string;
  onClick?: () => void;
}

const Box: React.FC<PropsWithChildren<IBoxProps>> = props => {
  const { customStyle = '', onClick, children } = props;

  // if onClick is defined, use cursor pointer, unless otherwise
  const cursorStyle = `cursor-${typeof onClick === 'function' ? 'pointer' : 'default'}`;

  const className = apply`${cursorStyle} ${customStyle}`;

  return (
    <div className={tw(className)} onClick={onClick}>
      {children}
    </div>
  );
};

export default Box;

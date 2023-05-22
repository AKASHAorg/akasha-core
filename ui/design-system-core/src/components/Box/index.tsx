import React, { PropsWithChildren } from 'react';
import { apply, tw } from '@twind/core';

export interface IBoxProps {
  customStyle?: string;
}

const Box: React.FC<
  PropsWithChildren<
    IBoxProps & React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>
  >
> = props => {
  const { customStyle = '', children, ...rest } = props;

  const className = apply`${customStyle}`;

  return (
    <div className={tw(className)} {...rest}>
      {children}
    </div>
  );
};

export default Box;

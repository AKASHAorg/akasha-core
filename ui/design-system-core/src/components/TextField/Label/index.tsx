import { apply, tw } from '@twind/core';
import React, { PropsWithChildren } from 'react';
import { LabelProps } from '../types';

const Label: React.FC<PropsWithChildren<LabelProps>> = ({ disabled, children }) => {
  const labelStyle = disabled ? `text-grey4` : `text-dark dark:text-white`;
  return (
    <div className={tw(apply(`${labelStyle} text-[1rem] leading-[1.125rem] font-medium`))}>
      {children}
    </div>
  );
};

export default Label;

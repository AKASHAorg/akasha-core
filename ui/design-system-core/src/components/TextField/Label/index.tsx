import React, { PropsWithChildren } from 'react';
import { tw } from '@twind/core';
import { LabelProps } from '../types';

const Label: React.FC<PropsWithChildren<LabelProps>> = ({ disabled, children }) => {
  const labelStyle = disabled ? `text-grey4` : `text-dark dark:text-white`;
  return (
    <div className={tw(`${labelStyle} text-[1rem] leading-[1.125rem] font-medium`)}>{children}</div>
  );
};

export default Label;

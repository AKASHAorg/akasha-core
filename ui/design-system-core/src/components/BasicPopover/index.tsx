import React from 'react';
import { tw } from '@twind/core';

import { IBasicPopover } from '../../interfaces/basicpopover.interface';

const BasicPopover: React.FC<IBasicPopover> = ({ children, ...props }) => {
  const { gap, overflow = 'hidden' } = props;

  const className = `
  overflow-${overflow} overflow w-[21rem] mt-${
    gap ? `[${gap}]` : '2.5'
  } ml-6 border-1 border-${'[#425166]'} rounded
  `;
  return <div className={tw(className)}>{children}</div>;
};

export default BasicPopover;

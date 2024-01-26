import React from 'react';
import { apply, tw } from '@twind/core';

export type OverflowType = 'auto' | 'hidden' | 'scroll' | 'visible';

export type BasicPopoverProps = {
  children: React.ReactNode;
  closePopover: () => void;
  target: HTMLElement;
  gap?: string;
  overflow?: OverflowType | { horizontal?: OverflowType; vertical?: OverflowType };
};

const BasicPopover: React.FC<BasicPopoverProps> = ({ children, ...props }) => {
  const { gap, overflow = 'hidden' } = props;

  const className = apply`
  overflow-${overflow} w-[21rem] mt-${
    gap ? `[${gap}]` : '2.5'
  } ml-6 border-1 border-${'[#425166]'} rounded
  `;

  return <div className={tw(className)}>{children}</div>;
};

export default BasicPopover;

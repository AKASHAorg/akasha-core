import React, { PropsWithChildren } from 'react';
import { tw, apply } from '@twind/core';

export type ScrollTopWrapperProps = {
  placement?: React.CSSProperties['marginLeft'];
};

const ScrollTopWrapper: React.FC<PropsWithChildren<ScrollTopWrapperProps>> = ({
  placement,
  children,
}) => {
  return (
    <div className={tw(apply(`fixed bottom-[20px] z-10 ${placement && `ml-[${placement}]`}`))}>
      {children}
    </div>
  );
};

export default ScrollTopWrapper;

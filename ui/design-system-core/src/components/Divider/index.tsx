import React from 'react';
import { apply, tw } from '@twind/core';
import { PropsWithChildren } from 'react';

type DividerProps = {
  className?: string;
};

const Divider: React.FC<PropsWithChildren<DividerProps>> = ({ className, children }) => {
  return (
    <div className={tw(apply(`rounded-[1.25rem] h-px w-full bg-grey8 dark:bg-grey5 ${className}`))}>
      {children}
    </div>
  );
};

export default Divider;

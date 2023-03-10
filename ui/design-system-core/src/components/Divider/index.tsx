import React from 'react';
import { apply, tw } from '@twind/core';
import { PropsWithChildren } from 'react';

type DividerProps = {
  style?: string;
};

const Divider: React.FC<PropsWithChildren<DividerProps>> = ({ style = '', children }) => {
  return (
    <div className={tw(apply(`rounded-[1.25rem] h-px w-full bg-grey8 dark:bg-grey5 ${style}`))}>
      {children}
    </div>
  );
};

export default Divider;

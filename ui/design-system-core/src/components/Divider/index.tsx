import React from 'react';
import { apply, tw } from '@twind/core';

export interface DividerProps {
  customStyle?: string;
}

const Divider: React.FC<DividerProps> = ({ customStyle = '' }) => {
  return (
    <div
      className={tw(apply`rounded-[1.25rem] h-px w-full bg-grey8 dark:bg-grey5 ${customStyle}`)}
    />
  );
};

export default Divider;

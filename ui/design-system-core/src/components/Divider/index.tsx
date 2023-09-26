import React from 'react';
import { apply, tw } from '@twind/core';

export interface DividerProps {
  customStyle?: string;
}

const Divider: React.FC<DividerProps> = ({ customStyle = '' }) => {
  return (
    <hr
      className={tw(
        apply`rounded-[1.25rem] h-px w-full border-grey8 dark:border-grey5 ${customStyle}`,
      )}
    />
  );
};

export default Divider;

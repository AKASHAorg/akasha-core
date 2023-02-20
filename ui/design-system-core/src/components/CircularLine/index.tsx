import { apply, tw } from '@twind/core';
import React from 'react';

export type CircularLineProps = {
  animated?: boolean;
  width?: string;
  height?: string;
  background?: string;
  className?: string;
};

const baseStyle = apply`rounded-full border-2 border-white dark:border-grey2`;

export const CircularLine: React.FC<CircularLineProps> = props => {
  const {
    animated,
    width = 'w-20',
    height = 'h-20',
    background = 'bg-gradient-to-r from-grey6 to-white dark:from-grey5 dark:to-grey7',
    className,
  } = props;

  const instanceStyles = apply`
    ${baseStyle} 
    ${animated ? 'animate-pulse' : ''}
    ${width} 
    ${height} 
    ${background} 
    ${className}
`;

  return <div className={tw(instanceStyles)} />;
};

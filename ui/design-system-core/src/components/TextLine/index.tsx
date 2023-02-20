import React from 'react';
import { tw, apply } from '@twind/core';

export type TextLineProps = {
  animated?: boolean;
  width?: string;
  height?: string;
  background?: string;
  round?: string;
  className?: string;
};

const baseStyle = apply`min-h-[18px]`;

const TextLine: React.FC<TextLineProps> = props => {
  const {
    animated,
    width = 'w-[19.4375rem]',
    height = 'h-[1.1875rem]',
    background = 'bg-gradient-to-r from-grey6 to-white dark:from-grey5 dark:to-grey7',
    round = 'rounded',
    className,
  } = props;
  const instanceStyles = apply`
    ${baseStyle}
    ${animated ? 'animate-pulse' : ''}
    ${width}
    ${height}
    ${background}
    ${round}
    ${className}
  `;

  return <div className={tw(instanceStyles)} />;
};
export default TextLine;

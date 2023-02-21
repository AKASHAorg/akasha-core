import React from 'react';
import { tw, apply } from '@twind/core';
import { getWidthClasses } from '../../utils/getWidthClasses';
import { getHeightClasses } from '../../utils/getHeightClasses';

export type TextLineProps = {
  title?: string;
  animated?: boolean;
  width?: string;
  height?: string;
  round?: string;
  className?: string;
};

const baseStyle = apply`min-h-[18px] bg-placeholder-gradient-light dark:placeholder-gradient-dark`;

const TextLine: React.FC<TextLineProps> = props => {
  const {
    title,
    animated,
    width = 'w-[19.4375rem]',
    height = 'h-[1.1875rem]',
    round = 'rounded',
    className,
  } = props;
  const widthStyle = getWidthClasses(width);
  const heightStyle = getHeightClasses(height);
  const instanceStyles = apply`
    ${baseStyle}
    ${animated ? 'animate-pulse' : ''}
    ${widthStyle}
    ${heightStyle}
    ${round}
    ${className}
  `;

  return <div title={title} className={tw(instanceStyles)} />;
};
export default TextLine;

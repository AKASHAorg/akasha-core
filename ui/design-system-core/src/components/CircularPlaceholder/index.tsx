import { apply, tw } from '@twind/core';
import React from 'react';
import { getHeightClasses } from '../../utils/getHeightClasses';
import { getWidthClasses } from '../../utils/getWidthClasses';

export type CircularPlaceholderProps = {
  title?: string;
  animated?: boolean;
  width?: string;
  height?: string;
  className?: string;
};

const baseStyle = apply`rounded-full border-2 border-white dark:border-grey2 bg-placeholder-gradient-light dark:placeholder-gradient-dark`;

export const CircularPlaceholder: React.FC<CircularPlaceholderProps> = props => {
  const { title, animated, width = 'w-20', height = 'h-20', className } = props;

  const widthStyle = getWidthClasses(width);
  const heightStyle = getHeightClasses(height);

  const instanceStyles = apply`
    ${baseStyle} 
    ${animated ? 'animate-pulse' : ''}
    ${widthStyle} 
    ${heightStyle} 
    ${className}
`;

  return <div title={title} className={tw(instanceStyles)} />;
};

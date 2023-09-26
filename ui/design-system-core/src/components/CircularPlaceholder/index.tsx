import React from 'react';
import { apply, tw } from '@twind/core';

import { getWidthClasses, getHeightClasses } from '../../utils';

export type CircularPlaceholderProps = {
  title?: string;
  animated?: boolean;
  width?: string | number;
  height?: string | number;
  customStyle?: string;
};

const baseStyle = apply`rounded-full border-2 border-white dark:border-grey2 bg-gradient-to-r from-grey6 via-grey8 to-white dark:from-grey5 dark:via-grey7 dark:to-white`;

const CircularPlaceholder: React.FC<CircularPlaceholderProps> = props => {
  const { title, animated, width = 'w-20', height = 'h-20', customStyle = '' } = props;

  const widthStyle = getWidthClasses(width);
  const heightStyle = getHeightClasses(height);

  const instanceStyles = apply`
    ${baseStyle}
    ${animated ? 'animate-pulse' : ''}
    ${widthStyle}
    ${heightStyle}
    ${customStyle}
`;

  return <div title={title} className={tw(instanceStyles)} />;
};

export default CircularPlaceholder;

import React from 'react';
import { tw, apply } from '@twind/core';

import { getWidthClasses, getHeightClasses } from '../../utils';

export type TextLineProps = {
  title?: string;
  animated?: boolean;
  width?: string | number;
  height?: string | number;
  round?: string;
  customStyle?: string;
};

const baseStyle = `bg-gradient-to-r from-grey6 via-grey8 to-white dark:from-grey5 dark:via-grey7 dark:to-white`;

const TextLine: React.FC<TextLineProps> = props => {
  const {
    title,
    animated,
    width = 'w-[19.4375rem]',
    height = 'h-[1.1875rem]',
    round = 'rounded',
    customStyle = '',
  } = props;

  const widthStyle = getWidthClasses(width);
  const heightStyle = getHeightClasses(height);

  const instanceStyles = apply`
    ${baseStyle}
    ${animated ? 'animate-pulse' : ''}
    ${widthStyle}
    ${heightStyle}
    ${round}
    ${customStyle}
  `;

  return <div title={title} className={tw(instanceStyles)} />;
};
export default TextLine;

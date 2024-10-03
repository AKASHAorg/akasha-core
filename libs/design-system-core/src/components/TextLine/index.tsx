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

/**
 * The TextLine component offers a quick way to include placeholder text lines in your app. These placeeholder text
 * lines are useful as loading indicators before the real content gets rendered. The component
 * supports many customization options such as width, height, radius, animation, etc.
 * @param title - (optional) title if there is any
 * @param animated - boolean (optional) whether to apply animation to the text line
 * @param width - (optional) for customizing the width
 * @param height - (optional) for customizing the height
 * @param round - (optional) for customizing the radius of the corner
 * @param customStyle - (optional) apply any other custom styles. Please use standard Tailwind CSS classes
 * @example
 * ```tsx
 * <TextLine title="tagName" animated={true} width="w-[110px]" height="h-[1rem]" />
 * ```
 **/
const TextLine: React.FC<TextLineProps> = props => {
  const {
    title,
    animated,
    width = 'w-[19.4375rem]',
    height = 'h-[1.1875rem]',
    round = 'rounded',
    customStyle = '',
  } = props;

  const baseStyle = `bg-gradient-to-r from-grey6 via-grey8 to-white dark:from-grey5 dark:via-grey7 dark:to-white`;

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

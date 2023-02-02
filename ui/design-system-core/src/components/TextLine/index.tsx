import React from 'react';
import { tw, apply } from '@twind/core';

export interface ITextLine {
  title?: string;
  animated?: boolean;
  width?: string;
  height?: string;
  className?: string;
}
const baseStyles = apply`min-h-[18px] flex flex-row justify-center items-center px-2 py-2`;

const TextLine: React.FC<ITextLine> = props => {
  const { animated, title, width, height, className } = props;
  const instanceStyles = apply`
    ${baseStyles}
    ${className}
    ${
      animated
        ? 'bg-gradient-to-r from-purple-500 to-pink-500 animate-[bgRotate_1s_ease_infinite]'
        : ''
    }
    ${width ? `w-[${width}]` : ''}
    ${width ? `h-[${height}]` : ''}
  `;
  return <div className={tw(instanceStyles)}>{title}</div>;
};
export default TextLine;

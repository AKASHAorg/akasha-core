import React, { LegacyRef, PropsWithChildren, forwardRef } from 'react';
import { getAlignClasses } from './getAlignClasses';
import { getDirectionClasses } from './getDirectionClasses';
import { getJustifyClasses } from './getJustifyClasses';
import { apply, tw } from '@twind/core';

export type Direction = 'column' | 'column-reverse' | 'row' | 'row-reverse';
export type Align = 'start' | 'end' | 'center' | 'stretch' | 'baseline';
export type Justify = 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly';

export type StackProps = {
  direction?: 'column' | 'column-reverse' | 'row' | 'row-reverse';
  justify?: Justify;
  align?: Align;
  spacing?: string;
  customStyle?: string;
  fullWidth?: boolean;
  ref?: LegacyRef<HTMLDivElement>;
};

const Stack: React.FC<PropsWithChildren<StackProps>> = forwardRef(
  (
    { direction = 'row', justify, align, spacing = '', customStyle = '', fullWidth, children },
    ref,
  ) => {
    const baseStyle = `flex`;
    const justifyStyle = justify ? getJustifyClasses(justify) : '';
    const alignStyle = align ? getAlignClasses(align) : '';
    const directionStyle = direction ? getDirectionClasses(direction) : '';
    const fullWidthStyle = fullWidth ? 'w-full' : '';
    return (
      <div
        className={tw(
          apply`${baseStyle} ${directionStyle} ${justifyStyle} ${alignStyle} ${spacing} ${fullWidthStyle} ${customStyle}`,
        )}
        ref={ref}
      >
        {children}
      </div>
    );
  },
);

export default Stack;

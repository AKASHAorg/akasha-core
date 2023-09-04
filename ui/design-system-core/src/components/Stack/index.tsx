import React, { LegacyRef, PropsWithChildren, forwardRef } from 'react';
import { getAlignClasses } from './getAlignClasses';
import { getDirectionClasses } from './getDirectionClasses';
import {
  getJustifyClasses,
  getJustifyItemsClasses,
  getJustifySelfClasses,
} from './getJustifyClasses';
import { apply, tw } from '@twind/core';

export type Direction = 'column' | 'column-reverse' | 'row' | 'row-reverse';
export type Align = 'start' | 'end' | 'center' | 'stretch' | 'baseline';
export type Justify = 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly';
export type JustifyItems = 'start' | 'end' | 'center' | 'stretch';
export type JustifySelf = 'auto' | 'start' | 'end' | 'center' | 'stretch';

export type StackProps = {
  direction?: 'column' | 'column-reverse' | 'row' | 'row-reverse';
  justify?: Justify;
  justifyItems?: JustifyItems;
  justifySelf?: JustifySelf;
  align?: Align;
  spacing?: `gap-x-${number}` | `gap-y-${number}` | `gap-${number}`;
  customStyle?: string;
  fullWidth?: boolean;
  testId?: string;
  ref?: LegacyRef<HTMLDivElement>;
};

const Stack: React.FC<PropsWithChildren<StackProps>> = forwardRef(
  (
    {
      direction = 'column',
      justify,
      justifyItems,
      justifySelf,
      align,
      spacing = '',
      customStyle = '',
      fullWidth,
      testId,
      children,
    },
    ref,
  ) => {
    const baseStyle = `flex`;
    const justifyStyle = justify ? getJustifyClasses(justify) : '';
    const justifyItemsStyle = justifyItems ? getJustifyItemsClasses(justifyItems) : '';
    const justifySelfStyle = justifySelf ? getJustifySelfClasses(justifySelf) : '';
    const alignStyle = align ? getAlignClasses(align) : '';
    const directionStyle = direction ? getDirectionClasses(direction) : '';
    const fullWidthStyle = fullWidth ? 'w-full' : '';
    return (
      <div
        className={tw(
          apply`${baseStyle} ${directionStyle} ${justifyStyle} ${justifyItemsStyle} ${justifySelfStyle} ${alignStyle} ${spacing} ${fullWidthStyle} ${customStyle}`,
        )}
        data-testid={testId}
        ref={ref}
      >
        {children}
      </div>
    );
  },
);

export default Stack;

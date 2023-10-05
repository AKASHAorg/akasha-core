import React, { LegacyRef, PropsWithChildren, forwardRef } from 'react';
import { getPaddingClasses } from '../../utils';
import { getAlignClasses } from './getAlignClasses';
import { getDirectionClasses } from './getDirectionClasses';
import {
  getJustifyClasses,
  getJustifyItemsClasses,
  getJustifySelfClasses,
} from './getJustifyClasses';
import { apply, tw } from '@twind/core';
import { Padding } from '../types/common.types';

export type Direction = 'column' | 'column-reverse' | 'row' | 'row-reverse';
export type Align = 'start' | 'end' | 'center' | 'stretch' | 'baseline';
export type Justify = 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly';
export type JustifyItems = 'start' | 'end' | 'center' | 'stretch';
export type JustifySelf = 'auto' | 'start' | 'end' | 'center' | 'stretch';

export type StackProps = {
  direction?: Direction;
  padding?: Padding;
  justify?: Justify;
  justifyItems?: JustifyItems;
  justifySelf?: JustifySelf;
  align?: Align;
  spacing?: `gap-x-${number}` | `gap-y-${number}` | `gap-${number}`;
  customStyle?: string;
  fullWidth?: boolean;
  testId?: string;
  ref?: LegacyRef<HTMLDivElement>;
  id?: string;
};

const Stack: React.FC<PropsWithChildren<StackProps>> = forwardRef(
  (
    {
      direction = 'column',
      padding = 'p-0',
      justify,
      justifyItems,
      justifySelf,
      align,
      spacing = '',
      customStyle = '',
      fullWidth,
      testId,
      children,
      id,
    },
    ref,
  ) => {
    const baseStyle = `flex`;
    const paddingStyle = getPaddingClasses(padding);
    const justifyStyle = justify ? getJustifyClasses(justify) : '';
    const justifyItemsStyle = justifyItems ? getJustifyItemsClasses(justifyItems) : '';
    const justifySelfStyle = justifySelf ? getJustifySelfClasses(justifySelf) : '';
    const alignStyle = align ? getAlignClasses(align) : '';
    const directionStyle = direction ? getDirectionClasses(direction) : '';
    const fullWidthStyle = fullWidth ? 'w-full' : '';
    return (
      <div
        id={id}
        className={tw(
          apply`${baseStyle} ${directionStyle} ${paddingStyle} ${justifyStyle} ${justifyItemsStyle} ${justifySelfStyle} ${alignStyle} ${spacing} ${fullWidthStyle} ${customStyle}`,
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

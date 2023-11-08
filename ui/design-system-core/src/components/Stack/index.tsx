import React, { LegacyRef, PropsWithChildren, forwardRef } from 'react';
import { getPaddingClasses, getColorClasses } from '../../utils';
import { getAlignClasses, getAlignSelfClasses } from './getAlignClasses';
import { getDirectionClasses } from './getDirectionClasses';
import {
  getJustifyClasses,
  getJustifyItemsClasses,
  getJustifySelfClasses,
} from './getJustifyClasses';
import { apply, tw } from '@twind/core';
import { Color, Padding } from '../types/common.types';

export type Direction = 'column' | 'column-reverse' | 'row' | 'row-reverse';
export type Align = 'start' | 'end' | 'center' | 'stretch' | 'baseline';
export type AlignSelf = 'auto' | 'start' | 'end' | 'center' | 'stretch';
export type Justify = 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly';
export type JustifyItems = 'start' | 'end' | 'center' | 'stretch';
export type JustifySelf = 'auto' | 'start' | 'end' | 'center' | 'stretch';

export type StackProps = {
  direction?: Direction;
  padding?: Padding;
  justify?: Justify;
  justifyItems?: JustifyItems;
  justifySelf?: JustifySelf;
  alignSelf?: AlignSelf;
  align?: Align;
  background?: Color;
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
      background,
      padding = 'p-0',
      justify,
      justifyItems,
      justifySelf,
      alignSelf,
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
    const backgroundStyle = getColorClasses(background, 'bg');
    const paddingStyle = getPaddingClasses(padding);
    const justifyStyle = justify ? getJustifyClasses(justify) : '';
    const justifyItemsStyle = justifyItems ? getJustifyItemsClasses(justifyItems) : '';
    const justifySelfStyle = justifySelf ? getJustifySelfClasses(justifySelf) : '';
    const alignSelfStyle = alignSelf ? getAlignSelfClasses(alignSelf) : '';
    const alignStyle = align ? getAlignClasses(align) : '';
    const directionStyle = direction ? getDirectionClasses(direction) : '';
    const fullWidthStyle = fullWidth ? 'w-full' : '';
    return (
      <div
        id={id}
        className={tw(
          apply`${baseStyle} ${directionStyle} ${backgroundStyle} ${paddingStyle} ${justifyStyle} ${alignSelfStyle} ${justifyItemsStyle} ${justifySelfStyle} ${alignStyle} ${spacing} ${fullWidthStyle} ${customStyle}`,
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

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

export type StackProps = PropsWithChildren<{
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
  dataTestId?: string;
  ref?: LegacyRef<HTMLDivElement>;
  id?: string;
}>;

/**
 * A Stack component is a container that lays out its content in one direction using flexbox.
 * It can be used to arrange other components.
 * @param direction - (optional) use this prop to control how child elements are placed in this flex container.
 * The default direction is `column`
 * @param padding - (optional) for customizing the padding (see example of usage below)
 * @param justify - (optional) for customizing the aligment of items along the main axis of the flex
 * container (see example of usage below)
 * @param justifyItems - (optional) for customizing the aligment of items along their inline axis
 * @param justifySelf - (optional) for customizing the aligment of an individual item along its inline axis
 * @param alignSelf - (optional) for customizing the position of an individual item along its container's cross
 * axis
 * @param align - (optional) for customizing the position of items along its container's cross
 * axis
 * @param background - (optional) for customizing the background color of the Stack
 * @param spacing - (optional) for customizing the gap among items in the x or y axis, or both (see example of usage below)
 * @param customStyle - (optional) apply any other custom styles. Please use standard Tailwind CSS classes
 * @param fullWidth - boolean (optional) whether the Stack will occupy the full width of the parent element
 * @param dataTestId - (optional) useful for test writing purpose
 * @param ref - (optional) pass the `ref` here
 * @param id - (optional) id of the Stack element, if any
 * ```tsx
 *  <Stack direction="row" align="center" justify="between" spacing="gap-4" padding="p-4" fullWidth>
      <ExampleComponent1>
      <ExampleComponent2>
    </Stack>
 * ```
 **/
const Stack: React.FC<StackProps> = forwardRef(
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
      dataTestId,
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
        data-testid={dataTestId}
        ref={ref}
      >
        {children}
      </div>
    );
  },
);

export default Stack;

import React, { PropsWithChildren } from 'react';
import { tw, apply } from '@twind/core';
import { getTag } from './getTag';
import { getAlignmentClasses } from './getAlignmentClasses';
import { getColorClasses } from '../../utils/getColorClasses';
import { getWeightClasses } from './getWeightClasses';
import { Color } from '../types/common.types';

export type Heading = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

export type BodyText =
  | 'subtitle1'
  | 'subtitle2'
  | 'body1'
  | 'body2'
  | 'label'
  | 'footnotes1'
  | 'footnotes2';

export type ButtonText = 'button-lg' | 'button-md' | 'button-sm';

export type Variant = Heading | BodyText | ButtonText;

export type Alignment = 'start' | 'center' | 'end' | 'justify';

export type Weight = 'normal' | 'bold' | 'light' | 'medium';

export type TextProps = {
  className?: string; // pass only the string classes without 'apply' or 'tw'
  variant?: Variant;
  color?: Color;
  align?: Alignment;
  truncate?: boolean;
  weight?: Weight;
};

const VARIANT_TO_CSS_CLASSES_MAPPER: Record<Variant, string> = {
  h1: 'text-[4rem] leading-[5rem] font-bold',
  h2: 'text-[3rem] leading-[4rem] font-bold',
  h3: 'text-[2rem] leading-[3rem] font-bold',
  h4: 'text-[1.5rem] leading-[2.25rem] font-bold',
  h5: 'text-[1.25rem] leading-[1.875rem] font-bold',
  h6: 'text-[1rem] leading-[1.5rem] font-bold',
  subtitle1: 'text-[1rem] leading-[1.5rem] font-light',
  subtitle2: 'text-[0.875rem] leading-[1.375rem] font-light',
  body1: 'text-[1rem] leading-[1.5rem] font-normal',
  body2: 'text-[0.875rem] leading-[1.375rem] font-normal',
  label: 'text-[1rem] leading-[1.5rem] font-medium',
  footnotes1: 'text-[0.75rem] leading-[1.125rem] font-bold tracking-[.075em]',
  footnotes2: 'text-[0.75rem] leading-[1.125rem] font-medium',
  'button-lg': 'block text-[1rem] leading-[1.5rem] font-bold',
  'button-md': 'block text-[0.875rem] leading-[1.5rem] font-bold',
  'button-sm': 'block text-[0.75rem] leading-[1.125rem] font-medium',
};

const Text: React.FC<PropsWithChildren<TextProps>> = ({
  className,
  variant = 'body1',
  align,
  color = { dark: 'text-white', light: 'text-black' },
  truncate,
  weight,
  children,
}) => {
  const tag = getTag(variant);
  const alignmentStyle = align ? getAlignmentClasses(align) : '';
  const colorStyle = getColorClasses(color);
  const truncateStyle = truncate ? 'truncate' : '';
  const weightStyle = weight ? getWeightClasses(weight) : '';

  const baseStyles = VARIANT_TO_CSS_CLASSES_MAPPER[variant];

  return React.createElement(
    tag,
    {
      className: tw(
        apply`${baseStyles} ${colorStyle} ${alignmentStyle} ${truncateStyle} ${weightStyle} ${
          className ?? ''
        }`,
      ),
    },
    children,
  );
};

export default Text;

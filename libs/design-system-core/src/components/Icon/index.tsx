import React from 'react';
import { apply, tw } from '@twind/core';

import Stack from '../Stack';

import { BasicIconSize, BasicSize, BreakPointSize, Color } from '../types/common.types';
import { getWidthClasses, getHeightClasses, getColorClasses } from '../../utils';

export interface IconProps {
  color?: Color;
  ref?: React.Ref<HTMLDivElement>;
  icon?: React.ReactElement;
  size?: BasicIconSize;
  breakPointSize?: BreakPointSize;
  accentColor?: boolean;
  disabled?: boolean;
  hover?: boolean;
  dataTestId?: string;
  customStyle?: string;
  hoverColor?: Color;
  solid?: boolean;
  rotateAnimation?: boolean;
}

/**
 * An Icon's purpose is as clear as its name indicates: provide an icon. In our design
 * system, we use [Heroicons](https://heroicons.com/) together with our own icons to make
 * up a rich icon library that you can easily include in your app and apply custom styling
 * to them through props as you see fit.
 * @param color - (optional) customize the color of your icon
 * @param ref - (optional) pass the ref here
 * @param size - (optional) customize the size of your icon
 * @param breakPointSize - (optional) specify breakpoint sizes if needed
 * @param accentColor - boolean (optional) whether your icon will have the default accent color scheme
 * @param disabled - boolean (optional) a disabled icon looks different
 * @param hover - boolean (optional) a hovered icon has a different shade
 * @param dataTestId - (optional) useful when writing tests for the component
 * @param customStyle - (optional) apply your custom styling (Make sure to use standard Tailwind classes)
 * @param hoverColor - (optional) specify a color for hover state here (Please note that you can specify colors for light and dark mode separately)
 * @param solid - boolean (optional) a solid icon looks different from an outlined one
 * @param rotateAnimation - boolean (optional) for those who want to add rotate animation to their icon
 * @example
 * ```tsx
 *  <Icon accentColor icon={<XMarkIcon />} />
 * ```
 **/
const Icon: React.FC<IconProps> = props => {
  const {
    icon,
    ref,
    accentColor = false,
    size = 'md',
    breakPointSize,
    color,
    disabled,
    hover,
    dataTestId,
    customStyle = '',
    hoverColor,
    solid = false,
    rotateAnimation = false,
  } = props;

  const breakPointStyle = breakPointSize
    ? ICON_SIZE_MAP_BY_BREAKPOINT(breakPointSize.breakPoint)[breakPointSize.size]
    : '';

  const sizeStyle =
    typeof size === 'object'
      ? `${getWidthClasses(size?.width)} ${getHeightClasses(size?.height)}`
      : `${ICON_SIZE_MAP[size]} ${breakPointStyle}`;

  const baseStyle = `select-none ${
    hover
      ? `cursor-pointer ${getColorClasses(
          hoverColor,
          solid ? 'group-hover:[&>*]:fill' : 'group-hover:[&>*]:stroke',
        )}`
      : ''
  }`;

  let colorStyle: string;
  if (color) {
    colorStyle = `${getColorClasses(color, solid ? '[&>*]:fill' : '[&>*]:stroke')}`;
  } else {
    colorStyle = solid
      ? '[&>*]:fill-black dark:[&>*]:fill-white'
      : '[&>*]:stroke-black dark:[&>*]:stroke-white';
  }

  const accentColorStyle = accentColor
    ? `${
        solid
          ? '[&>*]:fill-secondaryLight dark:[&>*]:fill-secondaryDark'
          : '[&>*]:stroke-secondaryLight dark:[&>*]:stroke-secondaryDark'
      }`
    : '';

  // Note: setting accentColor to true will overrride other color styles
  const activeIconColorStyle = accentColor ? accentColorStyle : colorStyle;

  const disabledStyle = disabled ? 'opacity-50' : '';

  const rotateStyle = rotateAnimation ? 'animate-spin' : '';

  const iconStyle = `${baseStyle} ${activeIconColorStyle} ${sizeStyle} ${disabledStyle} ${rotateStyle}`;

  return (
    <Stack ref={ref} customStyle={customStyle}>
      {React.cloneElement(icon, {
        className: tw(apply(iconStyle)),
        'data-testid': dataTestId,
      })}
    </Stack>
  );
};

const ICON_SIZE_MAP: Record<BasicSize, string> = {
  xs: 'h-3 w-3',
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-6 w-6',
  xl: 'h-7 w-7',
};

const ICON_SIZE_MAP_BY_BREAKPOINT = (breakPoint: string): Record<BasicSize, string> => ({
  xs: `${breakPoint}:h-3 ${breakPoint}:w-3`,
  sm: `${breakPoint}:h-4 ${breakPoint}:w-4`,
  md: `${breakPoint}:h-5 ${breakPoint}:w-5`,
  lg: `${breakPoint}:h-6 ${breakPoint}:w-6`,
  xl: `${breakPoint}:h-7 ${breakPoint}:w-7`,
});

export default Icon;

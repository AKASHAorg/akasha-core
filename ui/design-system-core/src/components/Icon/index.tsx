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
  testId?: string;
  customStyle?: string;
  hoverColor?: Color;
  solid?: boolean;
  rotateAnimation?: boolean;
}

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
    testId,
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
        'data-testid': testId,
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

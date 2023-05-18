import React from 'react';
import Stack from '../Stack';
import { IconType } from '@akashaorg/typings/ui';
import { PassedIcon } from './PassedIcon';
import { BasicIconSize, BreakPointSize, Color } from '../types/common.types';
import { getWidthClasses } from '../../utils/getWidthClasses';
import { getHeightClasses } from '../../utils/getHeightClasses';
import { getColorClasses } from '../../utils/getColorClasses';

export type IconSize = BasicIconSize | { width?: string | number; height?: string | number };

export interface IconProps {
  color?: Color;
  ref?: React.Ref<HTMLDivElement>;
  type: IconType;
  size?: IconSize;
  breakPointSize?: BreakPointSize;
  accentColor?: boolean;
  disabled?: boolean;
  hover?: boolean;
  testId?: string;
  customStyle?: string;
  hoverColor?: Color;
  solid?: boolean;
}

const fillOnlyIcons: IconType[] = ['akasha', 'discord', 'telegram', 'twitter', 'widget'];

const Icon: React.FC<IconProps> = props => {
  const {
    type,
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
  } = props;

  const breakPointStyle = breakPointSize
    ? ICON_SIZE_MAP_BY_BREAKPOINT(breakPointSize.breakPoint)[breakPointSize.size]
    : '';

  const sizeStyle =
    typeof size === 'object'
      ? `${getWidthClasses(size?.width)} ${getHeightClasses(size?.height)}`
      : `${ICON_SIZE_MAP[size]} ${breakPointStyle}`;

  const isFillOnlyIcon = fillOnlyIcons.includes(type) || solid;

  const baseStyle = `select-none ${
    hover
      ? `cursor-pointer ${getColorClasses(
          hoverColor,
          isFillOnlyIcon ? 'group-hover:[&>*]:fill' : 'group-hover:[&>*]:stroke',
        )}`
      : ''
  }`;

  const colorStyle = color
    ? `${getColorClasses(color, isFillOnlyIcon ? '[&>*]:fill' : '[&>*]:stroke')}`
    : isFillOnlyIcon
    ? '[&>*]:fill-black dark:[&>*]:fill-white'
    : '[&>*]:stroke-black dark:[&>*]:stroke-white';

  const accentColorStyle = accentColor
    ? `${
        isFillOnlyIcon
          ? '[&>*]:fill-secondaryLight dark:[&>*]:fill-secondaryDark'
          : '[&>*]:stroke-secondaryLight dark:[&>*]:stroke-secondaryDark'
      }`
    : '';

  // Note: setting accentColor to true will overrride other color styles
  const activeIconColorStyle = accentColor ? accentColorStyle : colorStyle;

  const disabledStyle = disabled ? 'opacity-50' : '';

  const iconStyle = `${baseStyle} ${activeIconColorStyle} ${sizeStyle} ${disabledStyle} ${customStyle}`;

  return (
    <Stack ref={ref}>
      <PassedIcon customStyle={iconStyle} testId={testId} type={type} solid={solid} />
    </Stack>
  );
};

const ICON_SIZE_MAP: Record<BasicIconSize, string> = {
  xs: 'h-3 w-3',
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-6 w-6',
};

const ICON_SIZE_MAP_BY_BREAKPOINT = (breakPoint: string): Record<BasicIconSize, string> => ({
  xs: `${breakPoint}:h-3 ${breakPoint}:w-3`,
  sm: `${breakPoint}:h-4 ${breakPoint}:w-4`,
  md: `${breakPoint}:h-5 ${breakPoint}:w-5`,
  lg: `${breakPoint}:h-6 ${breakPoint}:w-6`,
});

export default Icon;

import React from 'react';
import Stack from '../Stack';
import { BasicSize, Color } from '../types/common.types';
import { getWidthClasses } from '../../utils/getWidthClasses';
import { getHeightClasses } from '../../utils/getHeightClasses';
import { IconType } from '@akashaorg/typings/ui';
import { PassedIcon } from './PassedIcon';
import { getColorClasses } from '../../utils/getColorClasses';

export type IconSize = BasicSize | { width?: string | number; height?: string | number };

export interface IconProps {
  color?: Color;
  ref?: React.Ref<HTMLDivElement>;
  type: IconType;
  clickable?: boolean;
  size?: IconSize;
  breakPointSize?: { breakPoint: string; size: BasicSize };
  accentColor?: boolean;
  disabled?: boolean;
  testId?: string;
  hover?: boolean;
  customStyle?: string;
}

const fillOnlyIcons: IconType[] = ['akasha', 'discord', 'telegram', 'twitter', 'widget'];

const Icon: React.FC<IconProps> = props => {
  const {
    type,
    ref,
    accentColor,
    clickable,
    size = 'lg',
    breakPointSize,
    color,
    disabled,
    testId,
    hover,
    customStyle = '',
  } = props;

  const breakPointStyle = breakPointSize
    ? ICON_SIZE_MAP_BY_BREAKPOINT(breakPointSize.breakPoint)[breakPointSize.size]
    : '';

  const sizeStyle =
    typeof size === 'object'
      ? `${getWidthClasses(size?.width)} ${getHeightClasses(size?.height)}`
      : `${ICON_SIZE_MAP[size]} ${breakPointStyle}`;

  const isFillOnlyIcon = fillOnlyIcons.includes(type);

  const baseStyle = `select-none ${
    hover
      ? `cursor-pointer dark:group-hover:${
          isFillOnlyIcon ? '[&>*]:fill-white' : '[&>*]:stroke-white'
        }`
      : ''
  }`;

  const colorStyle = color
    ? `${
        isFillOnlyIcon
          ? `${getColorClasses(color, '[&>*]:fill')}`
          : `${getColorClasses(color, '[&>*]:stroke')}`
      }`
    : isFillOnlyIcon
    ? '[&>*]:fill-black dark:[&>*]:fill-white'
    : '[&>*]:stroke-black dark:[&>*]:stroke-white';

  const accentColorStyle = accentColor
    ? `${
        isFillOnlyIcon
          ? '[&>*]:fill-secondary-light dark:[&>*]:fill-secondary-dark'
          : '[&>*]:stroke-secondary-light dark:[&>*]:stroke-secondary-dark'
      }`
    : '';

  const iconStyle = `${baseStyle} ${colorStyle} ${sizeStyle} ${accentColorStyle} ${
    clickable && !disabled
      ? `cursor-pointer ${isFillOnlyIcon ? '' : 'hover:[&>*]:stroke-secondary-dark'}`
      : ''
  } ${customStyle}`;

  return (
    <Stack ref={ref}>
      <PassedIcon customStyle={iconStyle} testId={testId} type={type} />
    </Stack>
  );
};

const ICON_SIZE_MAP: Record<BasicSize, string> = {
  sm: 'h-3 w-3',
  md: 'h-4 w-4',
  lg: 'h-5 w-5',
  xl: 'h-6 w-6',
};

const ICON_SIZE_MAP_BY_BREAKPOINT = (breakPoint: string): Record<BasicSize, string> => ({
  sm: `${breakPoint}:h-3 ${breakPoint}:w-3`,
  md: `${breakPoint}:h-4 ${breakPoint}:w-4`,
  lg: `${breakPoint}:h-5 ${breakPoint}:w-5`,
  xl: `${breakPoint}:h-6 ${breakPoint}:w-6`,
});

export default Icon;

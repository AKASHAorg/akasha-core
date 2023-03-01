import React from 'react';
import * as HeroIcons from '@heroicons/react/24/outline';
import * as CustomIcons from './akasha-icons';
import Stack from '../Stack';
import { apply, tw } from '@twind/core';
import { BasicSize } from '../types/common.types';
import { getWidthClasses } from '../../utils/getWidthClasses';
import { getHeightClasses } from '../../utils/getHeightClasses';

export type IconType = CustomIcons.CustomIconTypes | keyof typeof HeroIcons;

export type IconSize = BasicSize | { width?: string | number; height?: string | number };

export interface IconProps {
  color?: string;
  ref?: React.Ref<HTMLDivElement>;
  type: IconType;
  clickable?: boolean;
  size?: IconSize;
  breakPointSize?: { breakPoint: string; size: BasicSize };
  plain?: boolean;
  accentColor?: boolean;
  disabled?: boolean;
  testId?: string;
  styling?: string;
}

export const iconTypes: IconType[] = [
  'akasha',
  'appCenter',
  'appModeration',
  'bookmark',
  'chatBubble',
  'discord',
  'explore',
  'github',
  'message',
  'notifications',
  'search',
  'settingsAlt',
  'telegram',
  'twitter',
];

/*@TODO: change all custom icons into ones in the design system and remove the following */
const fillOnlyIcons: IconType[] = ['akasha', 'appModeration'];

/*@TODO: change all custom icons into ones in the design system and remove the following */
const fillAndStrokeIcons: IconType[] = ['twitter', 'telegram', 'discord'];

const Icon: React.FC<IconProps> = props => {
  const {
    type,
    ref,
    plain,
    accentColor,
    clickable,
    size = 'md',
    breakPointSize,
    color,
    disabled,
    testId,
    styling,
  } = props;

  const breakPointStyle = breakPointSize
    ? ICON_SIZE_MAP_BY_BREAKPOINT(breakPointSize.breakPoint)[breakPointSize.size]
    : '';

  const sizeStyle =
    typeof size === 'object'
      ? `${getWidthClasses(size?.width)} ${getHeightClasses(size?.height)}`
      : `${ICON_SIZE_MAP[size]} ${breakPointStyle}`;

  const PassedIcon = !HeroIcons[type] ? CustomIcons[type] : HeroIcons[type];

  if (!PassedIcon) {
    // tslint:disable-next-line no-console
    console.error('There is no such icon', type);
    return null;
  }

  /*@TODO: change all custom icons into ones in the design system and remove the following */
  const isFillOnlyIcon = fillOnlyIcons.includes(type);

  /*@TODO: change all custom icons into ones in the design system and remove the following */
  const isFillAndStrokeIcon = fillAndStrokeIcons.includes(type);

  const plainStyle = plain
    ? `${isFillOnlyIcon ? '' : '[&>*]:stroke-black dark:[&>*]:stroke-white'} ${
        isFillAndStrokeIcon ? '[&>*]:fill-transparent' : ''
      }`
    : '';
  const colorStyle = color ? `[&>*]:stroke-${color} [&>*]:fill-${color}` : '';
  const accentColorStyle = accentColor
    ? `${isFillOnlyIcon ? '' : '[&>*]:stroke-secondary-light dark:[&>*]:stroke-secondary-dark'} ${
        isFillAndStrokeIcon ? '[&>*]:fill-transparent' : ''
      }`
    : '';
  const iconStyle = `select-none ${plainStyle} ${colorStyle} ${accentColorStyle} ${
    clickable && !disabled
      ? `cursor-pointer ${isFillOnlyIcon ? '' : 'hover:[&>*]:stroke-secondary-dark'} ${
          isFillAndStrokeIcon ? 'hover:[&>*]:fill-transparent' : ''
        }`
      : ''
  }`;

  return (
    <Stack ref={ref}>
      <PassedIcon
        className={tw(apply`${iconStyle} ${sizeStyle} ${styling}`)}
        data-testid={testId}
      />
    </Stack>
  );
};

export const ICON_SIZE_MAP: Record<BasicSize, string> = {
  xs: 'w-3 w-3',
  sm: 'h-[0.9375rem] w-[0.9375rem]',
  md: 'h-[1.125rem] w-[1.125rem]',
  lg: 'h-[1.3125rem] w-[1.3125rem]',
};

export const ICON_SIZE_MAP_BY_BREAKPOINT = (breakPoint: string): Record<BasicSize, string> => ({
  xs: `${breakPoint}:w-3 ${breakPoint}:w-3`,
  sm: `${breakPoint}:h-4 ${breakPoint}:w-4`,
  md: `${breakPoint}:h-5 ${breakPoint}:w-5`,
  lg: `${breakPoint}:h-6 ${breakPoint}:w-6`,
});

export default Icon;

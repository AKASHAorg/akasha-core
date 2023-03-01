import React from 'react';
import * as HeroIcons from '@heroicons/react/24/outline';
import * as CustomIcons from './akasha-icons';
import Stack from '../Stack';
import { apply, tw } from '@twind/core';
import { ICON_SIZE_MAP, Size } from '../types/common.types';
import { getWidthClasses } from '../../utils/getWidthClasses';
import { getHeightClasses } from '../../utils/getHeightClasses';

export type IconType = CustomIcons.CustomIconTypes | keyof typeof HeroIcons;

export interface IconProps {
  color?: string;
  ref?: React.Ref<HTMLDivElement>;
  type: IconType;
  clickable?: boolean;
  size?: Size;
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
  'discord',
  'github',
  'notifications',
  'search',
  'settingsAlt',
  'telegram',
  'twitter',
];

const fillOnlyIcons: IconType[] = ['akasha', 'appModeration'];

const fillAndStrokeIcons: IconType[] = ['twitter', 'telegram', 'discord'];

const Icon: React.FC<IconProps> = props => {
  const {
    type,
    ref,
    plain,
    accentColor,
    clickable,
    size = 'xs',
    color,
    disabled,
    testId,
    styling,
  } = props;

  const sizeStyle =
    typeof size === 'object'
      ? `${getWidthClasses(size?.width)} ${getHeightClasses(size?.height)}`
      : ICON_SIZE_MAP[size];

  const PassedIcon = !HeroIcons[type] ? CustomIcons[type] : HeroIcons[type];

  if (!PassedIcon) {
    // tslint:disable-next-line no-console
    console.error('There is no such icon', type);
    return null;
  }

  const isFillOnlyIcon = fillOnlyIcons.includes(type);

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

export default Icon;

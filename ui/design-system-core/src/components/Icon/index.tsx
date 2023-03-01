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

const Icon: React.FC<IconProps> = props => {
  const {
    type,
    ref,
    plain,
    accentColor,
    clickable,
    size = 'sm',
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

  const isFillOnly = fillOnlyIcons.includes(type);

  const plainStyle = plain
    ? `${
        isFillOnly ? '' : '[&>*]:stroke-black dark:[&>*]:stroke-white'
      } [&>*]:fill-black dark:[&>*]:fill-white`
    : '';
  const colorStyle = color ? `[&>*]:stroke-${color} [&>*]:fill-${color}` : '';
  const accentColorStyle = accentColor
    ? `${
        isFillOnly ? '' : '[&>*]:stroke-secondary-light dark:[&>*]:stroke-secondary-dark'
      } [&>*]:fill-secondary-light dark:[&>*]:fill-secondary-dark`
    : '';
  const iconStyle = `select-none ${plainStyle} ${colorStyle} ${accentColorStyle} ${
    clickable && !disabled
      ? `cursor-pointer ${
          isFillOnly ? '' : 'hover:[&>*]:stroke-secondary-dark'
        } hover:[&>*]:fill-secondary-dark`
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

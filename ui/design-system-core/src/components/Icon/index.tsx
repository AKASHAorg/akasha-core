import React from 'react';
import { tw } from '@twind/core';

import * as HeroIcons from '@heroicons/react/24/outline';
import * as CustomIcons from './akasha-icons';

export type IconType = CustomIcons.CustomIconTypes | keyof typeof HeroIcons;

export interface IconProps {
  color?: string;
  ref?: React.Ref<HTMLDivElement>;
  type: IconType | string;
  clickable?: boolean;
  size?: 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | 'xxxl';
  plain?: boolean;
  accentColor?: boolean;
  isCustomIcon?: boolean;
  disabled?: boolean;
  testId?: string;
  styling?: string;
  onClick?: () => void;
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

const fillIcons: IconType[] = ['akasha', 'appModeration'];

const Icon: React.FC<IconProps> = props => {
  const {
    type,
    ref,
    isCustomIcon,
    plain,
    accentColor,
    clickable,
    color,
    disabled,
    testId,
    styling,
    onClick,
  } = props;

  const PassedIcon = isCustomIcon ? CustomIcons[type] : HeroIcons[type];

  if (!PassedIcon) {
    // tslint:disable-next-line no-console
    console.error('There is no such icon', type);
    return null;
  }

  const isfill = fillIcons.includes(type as IconType);

  // this determines what prop to target - 'fill' for fillIcons, 'stroke' for others
  const svgPrefix = isfill ? 'fill' : 'stroke';

  const className = `flex items-center justify-center select-none ${
    plain ? `[& *]:${svgPrefix}-black dark:[& *]:${svgPrefix}-white` : ''
  } ${color ? `[& *]:${svgPrefix}-${color}` : ''} ${
    accentColor ? `[& *]:${svgPrefix}-secondary-dark` : ''
  } ${clickable && !disabled ? `cursor-pointer hover:[& *]:${svgPrefix}-secondary-dark` : ''}`;

  return (
    <div className={tw(className)} ref={ref} onClick={onClick}>
      <PassedIcon className={styling} data-testid={testId} />
    </div>
  );
};

export default Icon;

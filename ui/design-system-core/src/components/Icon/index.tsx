import React from 'react';
import * as HeroIcons from '@heroicons/react/24/outline';
import * as CustomIcons from './akasha-icons';

export type IconType = CustomIcons.CustomIconTypes | keyof typeof HeroIcons;

export interface IconProps {
  type: IconType | string;
  size?: 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | 'xxxl';
  plain?: boolean;
  accentColor?: boolean;
  isCustomIcon?: boolean;
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

const Icon: React.FC<IconProps> = props => {
  const { type, isCustomIcon, styling } = props;

  const PassedIcon = isCustomIcon ? CustomIcons[type] : HeroIcons[type];

  if (PassedIcon === 'undefined') return null;

  return <PassedIcon className={styling} />;
};

export default Icon;

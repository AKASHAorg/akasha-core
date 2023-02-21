import React from 'react';
import * as HeroIcons from '@heroicons/react/24/outline';
import * as SolidHeroIcons from '@heroicons/react/24/solid';

export type icontype = 'solid' | 'outline';
export type IconName = keyof typeof HeroIcons;
export interface IconProps {
  icon: IconName;
  styling?: string;
  strokeColor?: string;
  fillColor?: string;
  iconType?: icontype;
}

const Icon: React.FC<IconProps> = ({
  icon,
  styling,
  strokeColor = 'currentColor',
  fillColor = 'currentColor',
  iconType = 'outline',
}) => {
  const PassedIcon = iconType === 'outline' ? HeroIcons[icon] : SolidHeroIcons[icon];

  return <PassedIcon className={styling} stroke={strokeColor} fill={fillColor} />;
};

export default Icon;

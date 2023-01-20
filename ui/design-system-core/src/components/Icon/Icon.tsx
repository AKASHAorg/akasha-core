import React from 'react';
import * as HeroIcons from '@heroicons/react/24/outline';

export type IconName = keyof typeof HeroIcons;
interface IconProps {
  icon: IconName;
  styling?: string;
}

export const Icon: React.FC<IconProps> = props => {
  const PassedIcon = HeroIcons[props.icon];

  return <PassedIcon className={props.styling} />;
};

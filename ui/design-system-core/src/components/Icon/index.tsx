import React from 'react';
import * as HeroIcons from '@heroicons/react/24/outline';
import * as CustomIcons from './akasha-icons';

export type IconName = CustomIcons.CustomIconTypes | keyof typeof HeroIcons;

interface IconProps {
  icon: IconName;
  styling?: string;
}

const Icon: React.FC<IconProps> = props => {
  const PassedIcon = HeroIcons[props.icon] ?? CustomIcons[props.icon];

  if (PassedIcon === 'undefined') return null;

  return <PassedIcon className={props.styling} />;
};

export default Icon;

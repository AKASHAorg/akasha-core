import React from 'react';
import * as HeroIcons from '@heroicons/react/24/outline';
import * as CustomIcons from './akasha-icons';

export type IconName = CustomIcons.CustomIconTypes | keyof typeof HeroIcons;

interface IconProps {
  icon: IconName;
  isCustomIcon?: boolean;
  styling?: string;
}

const Icon: React.FC<IconProps> = props => {
  const { icon, isCustomIcon, styling } = props;

  const PassedIcon = isCustomIcon ? CustomIcons[icon] : HeroIcons[icon];

  if (PassedIcon === 'undefined') return null;

  return <PassedIcon className={styling} />;
};

export default Icon;

import React from 'react';

import { LogoTypeSource } from '@akashaorg/typings/lib/ui';

import Icon from '../Icon';
import { AppIconProps } from '.';

export type AppImgProps = Pick<
  AppIconProps,
  'appImg' | 'size' | 'placeholderIcon' | 'breakPointSize' | 'accentColor' | 'solid'
>;

const IconByType: React.FC<AppImgProps> = ({
  appImg,
  size,
  placeholderIcon,
  solid = false,
  breakPointSize,
  accentColor,
}) => {
  if (appImg?.type === LogoTypeSource.ICON) {
    return (
      <Icon
        icon={appImg?.value}
        size={size}
        breakPointSize={breakPointSize}
        accentColor={accentColor}
        solid={solid}
      />
    );
  }

  if (appImg?.type === LogoTypeSource.STRING || appImg?.type === LogoTypeSource.IPFS) {
    return (
      <img
        loading="lazy"
        decoding="async"
        alt={appImg?.type}
        className={`rounded-[50%] object-contain`}
        src={appImg?.value}
      />
    );
  }
  return (
    <Icon
      icon={placeholderIcon}
      solid={solid}
      size={size}
      breakPointSize={breakPointSize}
      accentColor={accentColor}
    />
  );
};

export default IconByType;

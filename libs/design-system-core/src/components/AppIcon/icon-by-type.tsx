import React from 'react';

import { LogoTypeSource } from '@akashaorg/typings/lib/ui';

import { AppIconProps } from '.';

export type AppImgProps = Pick<
  AppIconProps,
  'appImg' | 'size' | 'placeholderIcon' | 'breakPointSize' | 'accentColor' | 'solid'
> & { customStyle?: string };

const IconByType: React.FC<AppImgProps> = ({
  appImg,
  size,
  placeholderIcon,
  solid = false,
  breakPointSize,
  accentColor,
  customStyle = '',
}) => {
  if (appImg?.type === LogoTypeSource.ICON) {
    return appImg?.value;
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
  return placeholderIcon;
};

export default IconByType;

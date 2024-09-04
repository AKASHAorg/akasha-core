import React from 'react';
import { apply, tw } from '@twind/core';

import { LogoTypeSource } from '@akashaorg/typings/lib/ui';

import Icon from '../Icon';
import { AppIconProps } from '.';
import { Color } from '../types/common.types';

const isStringIcon = (
  appImg: AppIconProps['appImg'],
): appImg is Omit<AppIconProps['appImg'], 'value'> & { value: string } => {
  return appImg.type === LogoTypeSource.ICON || appImg.type === LogoTypeSource.IPFS;
};

export type AppImgProps = Pick<
  AppIconProps,
  'appImg' | 'size' | 'placeholderIcon' | 'breakPointSize' | 'accentColor' | 'solid'
> & {
  color?: Color;
};

const IconByType: React.FC<AppImgProps> = ({
  appImg,
  size,
  placeholderIcon,
  solid = false,
  breakPointSize,
  accentColor,
  color,
}) => {
  if (appImg.type === LogoTypeSource.ICON) {
    return (
      <Icon
        icon={appImg?.value as React.ReactElement}
        size={size}
        breakPointSize={breakPointSize}
        accentColor={accentColor}
        color={color}
        solid={solid}
      />
    );
  }

  if (isStringIcon(appImg)) {
    return (
      <img
        loading="lazy"
        decoding="async"
        alt={appImg.type}
        className={tw(apply`rounded-[50%] object-contain`)}
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
      color={color}
    />
  );
};

export default IconByType;

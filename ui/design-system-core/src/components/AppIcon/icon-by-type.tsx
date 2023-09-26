import React from 'react';
import { apply, tw } from '@twind/core';

import { LogoTypeSource } from '@akashaorg/typings/lib/ui';

import Icon from '../Icon';
import { AppIconProps } from '.';
import { Color } from '../types/common.types';

export type AppImgProps = Pick<
  AppIconProps,
  'appImg' | 'size' | 'placeholderIconType' | 'breakPointSize' | 'accentColor'
> & {
  color?: Color;
};

const IconByType: React.FC<AppImgProps> = ({
  appImg,
  size,
  placeholderIconType,
  breakPointSize,
  accentColor,
  color,
}) => {
  if (appImg?.type === LogoTypeSource.ICON) {
    return (
      <Icon
        type={appImg?.value}
        size={size}
        breakPointSize={breakPointSize}
        accentColor={accentColor}
        color={color}
      />
    );
  }

  if (appImg?.type === (LogoTypeSource.String || LogoTypeSource.IPFS)) {
    return (
      <img
        alt={appImg.type}
        className={tw(apply`rounded-[50%] object-contain`)}
        src={appImg?.value}
      />
    );
  }
  return (
    <Icon
      type={placeholderIconType}
      size={size}
      breakPointSize={breakPointSize}
      accentColor={accentColor}
      color={color}
    />
  );
};

export default IconByType;

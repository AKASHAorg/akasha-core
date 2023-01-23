import React from 'react';
import { tw } from '@twind/core';

import AvatarImage from './AvatarImage';

import { IAvatarProps } from '../../interfaces/avatar.interface';
import { getAvatarFromSeed } from '../../utils/get-avatar-from-seed';

export const avatarSizesMap = {
  xs: '6',
  sm: '8',
  md: '10',
  lg: '16',
  xl: '20',
  xxl: '[7.5rem]',
};

export const avatarBorderSizesMap = {
  xs: '1',
  sm: '2',
  md: '4',
  lg: '8',
  xl: '[12px]',
  xxl: '[16px]',
};

export const avatarBorderColorsMap = {
  white: '[#ffffff]',
  darkerBlue: '[#0046CB]',
  accent: '[#8b9FFF]',
};

const Avatar: React.FC<IAvatarProps> = props => {
  const {
    ethAddress = '0x0000000000000000000000000000000',
    alt,
    publicImgPath = '/images',
    backgroundColor,
    src,
    size = 'md',
    border,
    borderColor,
    faded,
    active,
    isClickable = false,
    onClick,
  } = props;

  let avatarImageFallback: string;

  if (src?.fallbackUrl) {
    avatarImageFallback = src.fallbackUrl;
  }

  if (!avatarImageFallback) {
    const seed = getAvatarFromSeed(ethAddress);
    avatarImageFallback = `${publicImgPath}/avatar-placeholder-${seed}.webp`;
  }

  const className = `box-border cursor-${
    isClickable ? 'pointer' : 'default'
  } select-none relative overflow-hidden w-${avatarSizesMap[size]} h-${
    avatarSizesMap[size]
  } rounded-full bg-${backgroundColor ? backgroundColor : 'white'} border-${
    border ? avatarBorderSizesMap[border] : '0'
  } border-${borderColor ? avatarBorderColorsMap[borderColor] : 'transparent'}`;

  const activeOverlayClass = 'bg-[#8b9FFF] opacity-25 z-10 absolute top-0 left-0 w-full h-full';

  return (
    <div className={tw(className)} onClick={onClick}>
      <React.Suspense fallback={<></>}>
        <AvatarImage url={src?.url} alt={alt} fallbackUrl={avatarImageFallback} faded={faded} />
      </React.Suspense>

      {active && <div className={tw(activeOverlayClass)}></div>}
    </div>
  );
};

export default Avatar;

import React from 'react';
import { tw } from '@twind/core';

import AvatarImage from './AvatarImage';

import { getAvatarFromSeed } from '../../utils/get-avatar-from-seed';

export type AvatarSrc = { url?: string; fallbackUrl?: string };

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

export type AvatarBorderSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

export type AvatarBorderColor = 'white' | 'darkerBlue' | 'accent';

export interface IAvatarProps {
  ethAddress?: string | null;
  alt?: string;
  publicImgPath?: string;
  backgroundColor?: string;
  src?: AvatarSrc;
  size?: AvatarSize;
  border?: AvatarBorderSize;
  borderColor?: AvatarBorderColor;
  faded?: boolean;
  active?: boolean;
  isClickable?: boolean;
  onClick?: () => void;
}

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
  white: 'white',
  darkerBlue: 'grey2',
  accent: 'secondary',
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

  const activeOverlayClass =
    'bg-grey6 dark:bg-grey6 opacity-25 z-10 absolute top-0 left-0 w-full h-full';

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

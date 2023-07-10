import React from 'react';

import { Profile } from '@akashaorg/typings/ui';

import Box from '../Box';

import AvatarImage from './avatar-image';

import { getAvatarFromSeed } from '../../utils/get-avatar-from-seed';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

export type AvatarBorderSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

export type AvatarBorderColor = 'white' | 'darkerBlue' | 'accent';

export type AvatarProps = {
  profileId?: string | null;
  alt?: string;
  publicImgPath?: string;
  backgroundColor?: string;
  avatar?: Profile['avatar'];
  size?: AvatarSize;
  border?: AvatarBorderSize;
  borderColor?: AvatarBorderColor;
  faded?: boolean;
  active?: boolean;
  isClickable?: boolean;
  customStyle?: string;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
};

export const avatarSizesMap = {
  xs: 'w-6 h-6',
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-16 h-16',
  xl: 'w-20 h-20',
  xxl: 'w-[7.5rem] h-[7.5rem]',
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
  accent: 'secondaryDark',
};

const Avatar: React.FC<AvatarProps> = props => {
  const {
    profileId = '0x0000000000000000000000000000000',
    alt,
    publicImgPath = '/images',
    backgroundColor,
    avatar,
    size = 'md',
    border,
    borderColor,
    faded,
    active,
    isClickable = false,
    customStyle = '',
    onClick,
  } = props;

  let avatarImageFallback: string;

  if (!avatarImageFallback) {
    const seed = getAvatarFromSeed(profileId);
    avatarImageFallback = `${publicImgPath}/avatar-placeholder-${seed}.webp`;
  }

  const containerStyle = `box-border cursor-${
    isClickable ? 'pointer' : 'default'
  } select-none relative overflow-hidden ${avatarSizesMap[size]} rounded-full bg-${
    backgroundColor ? backgroundColor : 'white'
  } border-${border ? avatarBorderSizesMap[border] : '0'} border-${
    borderColor ? avatarBorderColorsMap[borderColor] : 'transparent'
  } ${customStyle}`;

  const activeOverlayClass =
    'bg-grey6 dark:bg-grey6 opacity-25 z-10 absolute top-0 left-0 w-full h-full';

  return (
    <Box customStyle={containerStyle} onClick={onClick}>
      {/* updating this logic, so that avatarImage loads with fallbackUrl even when avatar is null */}
      {(avatar || avatarImageFallback) && (
        <React.Suspense fallback={<></>}>
          <AvatarImage
            url={avatar?.default?.src}
            alt={alt}
            fallbackUrl={avatarImageFallback}
            faded={faded}
          />
        </React.Suspense>
      )}

      {active && <Box customStyle={activeOverlayClass} />}
    </Box>
  );
};

export default Avatar;

import React from 'react';

import { Profile } from '@akashaorg/typings/ui';

import Anchor from '../Anchor';
import Stack from '../Stack';

import AvatarImage from './avatar-image';
import {
  generateActiveOverlayClass,
  generateAvatarContainerStyle,
  getImageFromSeed,
} from '../../utils';

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
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
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
    const seed = getImageFromSeed(profileId, 7);
    avatarImageFallback = `${publicImgPath}/avatar-${seed}-min.webp`;
  }

  const containerStyle = generateAvatarContainerStyle({
    size,
    border,
    borderColor,
    customStyle,
    isClickable,
    backgroundColor,
  });

  const activeOverlayClass = generateActiveOverlayClass();

  return (
    <Anchor onClick={onClick} tabIndex={-6}>
      <Stack customStyle={containerStyle}>
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

        {active && <Stack customStyle={activeOverlayClass} />}
      </Stack>
    </Anchor>
  );
};

export default Avatar;

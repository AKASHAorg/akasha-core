import React from 'react';
import Anchor from '../Anchor';
import Stack from '../Stack';
import AvatarImage from './avatar-image';
import {
  generateActiveOverlayClass,
  generateAvatarContainerStyle,
  getImageFromSeed,
} from '../../utils';
import { type Image } from '@akashaorg/typings/lib/ui';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

export type AvatarBorderSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

export type AvatarBorderColor = 'white' | 'darkerBlue' | 'accent';

export type AvatarProps = {
  profileId?: string | null;
  alt?: string;
  publicImgPath?: string;
  backgroundColor?: string;
  avatar?: Image;
  alternativeAvatars?: Image[];
  size?: AvatarSize;
  border?: AvatarBorderSize;
  borderColor?: AvatarBorderColor;
  faded?: boolean;
  active?: boolean;
  isClickable?: boolean;
  href?: string;
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
    href,
    customStyle = '',
    onClick,
  } = props;

  const seed = getImageFromSeed(profileId, 7);
  const avatarFallback = `${publicImgPath}/avatar-${seed}-min.webp`;

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
    <Anchor href={href} onClick={onClick} tabIndex={-6}>
      <Stack customStyle={containerStyle}>
        {(avatar || avatarFallback) && (
          <React.Suspense fallback={<></>}>
            <AvatarImage url={avatar?.src} alt={alt} fallbackUrl={avatarFallback} faded={faded} />
          </React.Suspense>
        )}
        {active && <Stack customStyle={activeOverlayClass} />}
      </Stack>
    </Anchor>
  );
};

export default Avatar;

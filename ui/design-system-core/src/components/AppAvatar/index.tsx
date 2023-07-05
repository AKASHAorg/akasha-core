import React from 'react';
import { IntegrationTypes } from '@akashaorg/typings/ui';

import {
  avatarBorderColorsMap,
  avatarBorderSizesMap,
  avatarSizesMap,
  AvatarProps,
} from '../Avatar';
import Box from '../Box';

import AvatarImage from '../Avatar/avatar-image';

export type AppAvatarProps = AvatarProps & {
  appType: IntegrationTypes;
};

const AppAvatar: React.FC<AppAvatarProps> = props => {
  const {
    appType,
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
    onClick,
  } = props;

  let avatarImageFallback: string;

  if (avatar?.default) {
    avatarImageFallback = avatar.default.src;
  }

  if (!avatar?.default.src && appType === IntegrationTypes.APP) {
    // currently there are 3 placeholders for sidebar apps
    avatarImageFallback = `${publicImgPath}/sidebar-app-placeholder-${
      Math.floor(Math.random() * 3) + 1
    }.webp`;
  }

  if (!avatar?.default.src && appType === IntegrationTypes.WIDGET) {
    // currently there are 2 placeholders for sidebar apps
    avatarImageFallback = `${publicImgPath}/sidebar-widget-placeholder-${
      Math.floor(Math.random() * 2) + 1
    }.webp`;
  }

  const className = `box-border cursor-${
    isClickable ? 'pointer' : 'default'
  } select-none relative overflow-hidden w-${avatarSizesMap[size]} h-${
    avatarSizesMap[size]
  } rounded-full bg-${backgroundColor ? backgroundColor : 'white'} border-${
    border ? avatarBorderSizesMap[border] : '0'
  } border-${borderColor ? avatarBorderColorsMap[borderColor] : 'transparent'}`;

  const activeOverlayClass = 'bg-grey6 opacity-25 z-10 absolute top-0 left-0 w-full h-full';

  return (
    <Box customStyle={className} onClick={onClick}>
      <React.Suspense fallback={<></>}>
        <AvatarImage
          url={avatar?.default?.src}
          alt={alt}
          fallbackUrl={avatarImageFallback}
          faded={faded}
        />
      </React.Suspense>

      {active && <div className={activeOverlayClass}></div>}
    </Box>
  );
};

export default AppAvatar;

import React from 'react';
import { tw } from '@twind/core';

import { IntegrationTypes } from '@akashaorg/typings/ui';

import AvatarImage from '../Avatar/AvatarImage';
import {
  avatarBorderColorsMap,
  avatarBorderSizesMap,
  avatarSizesMap,
  IAvatarProps,
} from '../Avatar';

export interface IAppAvatarProps extends IAvatarProps {
  appType: IntegrationTypes;
}

const AppAvatar: React.FC<IAppAvatarProps> = props => {
  const {
    appType,
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

  if (!src?.fallbackUrl && appType === IntegrationTypes.APP) {
    // currently there are 3 placeholders for sidebar apps
    avatarImageFallback = `${publicImgPath}/sidebar-app-placeholder-${
      Math.floor(Math.random() * 3) + 1
    }.webp`;
  }

  if (!src?.fallbackUrl && appType === IntegrationTypes.WIDGET) {
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
    <div className={tw(className)} onClick={onClick}>
      <React.Suspense fallback={<></>}>
        <AvatarImage url={src?.url} alt={alt} fallbackUrl={avatarImageFallback} faded={faded} />
      </React.Suspense>

      {active && <div className={tw(activeOverlayClass)}></div>}
    </div>
  );
};

export default AppAvatar;

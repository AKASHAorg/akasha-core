import React from 'react';

import { ExtensionTypes } from '@akashaorg/typings/lib/ui';

import Link from '../Link';
import { AvatarProps } from '../Avatar';
import AvatarImage from '../Avatar/avatar-image';
import Stack from '../Stack';

import { generateActiveOverlayClass, generateAvatarContainerStyle } from '../../utils';

export type AppAvatarProps = AvatarProps & {
  appType: ExtensionTypes;
};

/**
 * An AppAvatar provides a fast and easy way to create an avatar component.
 * You can easily customize its size, border, background color, clickability and
 * apply custom styling using the corresponding props.
 * #### Usage
 * @example
 * ```tsx
 * const profileId = 'did:pkh:eip155:5:0x36c703c42dfa2437dc883e2e0884e57404e16493';
 * const avatar = { src: 'https://placebeard.it/360x360', height: 360, width: 360 };
 *
 * <AppAvatar avatar={avatar} appType={ExtensionTypes.APP} profileId={profileId} />
 * ```
 **/
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
    customStyle = '',
    onClick,
  } = props;

  let avatarFallback: string;

  if (avatar?.src) {
    avatarFallback = avatar?.src;
  }

  if (!avatar?.src && appType === ExtensionTypes.APP) {
    // currently there are 3 placeholders for sidebar apps
    avatarFallback = `${publicImgPath}/sidebar-app-placeholder-${
      Math.floor(Math.random() * 3) + 1
    }.webp`;
  }

  if (!avatar?.src && appType === ExtensionTypes.WIDGET) {
    // currently there are 2 placeholders for sidebar apps
    avatarFallback = `${publicImgPath}/sidebar-widget-placeholder-${
      Math.floor(Math.random() * 2) + 1
    }.webp`;
  }

  const className = generateAvatarContainerStyle({
    size,
    border,
    borderColor,
    customStyle,
    isClickable,
    backgroundColor,
  });

  const activeOverlayClass = generateActiveOverlayClass();

  return (
    <Link onClick={onClick} tabIndex={-1}>
      <Stack customStyle={className}>
        <React.Suspense fallback={<></>}>
          <AvatarImage url={avatar?.src} alt={alt} fallbackUrl={avatarFallback} faded={faded} />
        </React.Suspense>

        {active && <div className={activeOverlayClass}></div>}
      </Stack>
    </Link>
  );
};

export default AppAvatar;

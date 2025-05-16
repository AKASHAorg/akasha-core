import React from 'react';
import { getImageFromSeed } from '@akashaorg/ui/lib/library/get-image-from-seed';

import {
  AkashaAppApplicationType,
  AppImageSource,
} from '@akashaorg/typings/lib/sdk/graphql-types-new';
import { cssVars } from '@akashaorg/ui/lib/library/to-css-var';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import { Image, ImageFallback } from '@akashaorg/ui/lib/akasha-components/image';

export type AppAvatarProps = {
  appType: AkashaAppApplicationType;
  extensionId?: string;
  avatar?: AppImageSource;

  publicImgPath?: string;
  onClick?: React.MouseEventHandler;
  customStyle?: string;
  /* width in rem */
  width?: number;
  /* height in rem */
  height?: number;
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
 * <AppAvatar appType={AkashaAppApplicationType.App} avatar={avatar} />
 * ```
 **/
const AppAvatar: React.FC<AppAvatarProps> = props => {
  const {
    appType,
    extensionId,
    publicImgPath = '/images',
    avatar,
    onClick,
    customStyle,
    width = 3.75,
    height = 3.75,
  } = props;

  let avatarFallback: string;

  if (avatar?.src) {
    avatarFallback = avatar?.src;
  }

  const seed = getImageFromSeed(extensionId, 3);

  if (!avatar?.src) {
    switch (appType) {
      case AkashaAppApplicationType.App:
        avatarFallback = `${publicImgPath}/app-${seed}.webp`;
        break;
      case AkashaAppApplicationType.Widget:
        avatarFallback = `${publicImgPath}/widget-${seed}.webp`;
        break;
      case AkashaAppApplicationType.Plugin:
        avatarFallback = `${publicImgPath}/plugin-${seed}.webp`;
        break;
      case AkashaAppApplicationType.Other:
        avatarFallback = `${publicImgPath}/other-${seed}.webp`;
        break;
      default:
        avatarFallback = `${publicImgPath}/app-${seed}.webp`;
        break;
    }
  }

  const className = `shrink-0 overflow-hidden	rounded-[10px] bg-grey6 dark:bg-grey5 w-[var(--width)] h-[var(--height)] ${customStyle}`;

  return (
    <Stack
      style={cssVars({ '--width': `${width}rem`, '--height': `${height}rem` })}
      onClick={onClick}
      className={className}
    >
      <React.Suspense fallback={<></>}>
        <Image src={avatar?.src || avatarFallback} alt="App Avatar Image" />
      </React.Suspense>
    </Stack>
  );
};

export default AppAvatar;

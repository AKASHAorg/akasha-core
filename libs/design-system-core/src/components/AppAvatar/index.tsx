import React from 'react';

import Link from '../Link';
import AvatarImage from '../Avatar/avatar-image';
import Stack from '../Stack';
import { getImageFromSeed } from '../../utils';
import { getColorClasses, getRadiusClasses } from '../../utils';
import {
  AkashaAppApplicationType,
  AppImageSource,
} from '@akashaorg/typings/lib/sdk/graphql-types-new';

export type AppAvatarProps = {
  appType: AkashaAppApplicationType;
  extensionId?: string;
  avatar?: AppImageSource;

  publicImgPath?: string;
  onClick?: React.MouseEventHandler;
  customStyle?: string;
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
  const { appType, extensionId, publicImgPath = '/images', avatar, onClick, customStyle } = props;

  let avatarFallback: string;

  if (avatar?.src) {
    avatarFallback = avatar?.src;
  }

  const seed = getImageFromSeed(extensionId, 3);

  if (!avatar?.src) {
    switch (appType) {
      case AkashaAppApplicationType.App:
        avatarFallback = `${publicImgPath}/App-${seed}.webp`;
        break;
      case AkashaAppApplicationType.Widget:
        avatarFallback = `${publicImgPath}/Widget-${seed}.webp`;
        break;
      case AkashaAppApplicationType.Plugin:
        avatarFallback = `${publicImgPath}/Plugin-${seed}.webp`;
        break;
      case AkashaAppApplicationType.Other:
        avatarFallback = `${publicImgPath}/Other-${seed}.webp`;
        break;
      default:
        avatarFallback = `${publicImgPath}/App-${seed}.webp`;
        break;
    }
  }

  const className = `shrink-0 overflow-hidden	${getRadiusClasses(10)} ${getColorClasses(
    { light: 'grey6', dark: 'grey5' },
    'bg',
  )} w-[3.75rem] h-[3.75rem] ${customStyle}`;

  return (
    <Link onClick={onClick} tabIndex={-1}>
      <Stack customStyle={className}>
        <React.Suspense fallback={<></>}>
          <AvatarImage url={avatar?.src} fallbackUrl={avatarFallback} />
        </React.Suspense>
      </Stack>
    </Link>
  );
};

export default AppAvatar;

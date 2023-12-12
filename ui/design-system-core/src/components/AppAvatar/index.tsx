import React from 'react';

import { IntegrationTypes } from '@akashaorg/typings/lib/ui';

import Anchor from '../Anchor';
import { AvatarProps } from '../Avatar';
import AvatarImage from '../Avatar/avatar-image';
import Stack from '../Stack';

import { generateActiveOverlayClass, generateAvatarContainerStyle } from '../../utils';

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
    customStyle = '',
    onClick,
  } = props;

  let avatarFallback: string;

  if (avatar?.src) {
    avatarFallback = avatar?.src;
  }

  if (!avatar?.src && appType === IntegrationTypes.APP) {
    // currently there are 3 placeholders for sidebar apps
    avatarFallback = `${publicImgPath}/sidebar-app-placeholder-${
      Math.floor(Math.random() * 3) + 1
    }.webp`;
  }

  if (!avatar?.src && appType === IntegrationTypes.WIDGET) {
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
    <Anchor onClick={onClick} tabIndex={-6}>
      <Stack customStyle={className}>
        <React.Suspense fallback={<></>}>
          <AvatarImage url={avatar?.src} alt={alt} fallbackUrl={avatarFallback} faded={faded} />
        </React.Suspense>

        {active && <div className={activeOverlayClass}></div>}
      </Stack>
    </Anchor>
  );
};

export default AppAvatar;

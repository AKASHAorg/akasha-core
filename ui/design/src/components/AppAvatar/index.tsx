import * as React from 'react';
import { IntegrationTypes } from '@akashaorg/typings/ui';

import { AvatarProps } from '../Avatar';
import AvatarImage from '../Avatar/avatar-image';
import StyledAvatar, { ActiveOverlay } from '../Avatar/styled-avatar';

export interface AppAvatarProps extends AvatarProps {
  appType: IntegrationTypes;
}

const AppAvatar: React.FC<AppAvatarProps> = props => {
  const {
    onClick,
    src,
    className,
    size = 'md',
    margin,
    border,
    faded,
    active,
    publicImgPath = '/images',
    appType,
    backgroundColor,
  } = props;

  const isClickable = typeof onClick === 'function';
  let avatarImageFallback: string;

  if (src?.fallbackUrl) {
    avatarImageFallback = src.fallbackUrl;
  }

  if (!src?.fallbackUrl && appType === IntegrationTypes.APP) {
    // currently there are 3 placeholders for sidebar apps
    avatarImageFallback = `${publicImgPath}/sidebar-app-placeholder-${
      Math.floor(Math.random() * 3) + 1
    }.png`;
  }

  if (!src?.fallbackUrl && appType === IntegrationTypes.WIDGET) {
    // currently there are 2 placeholders for sidebar apps
    avatarImageFallback = `${publicImgPath}/sidebar-widget-placeholder-${
      Math.floor(Math.random() * 2) + 1
    }.png`;
  }

  return (
    <StyledAvatar
      onClick={onClick}
      size={size}
      className={className}
      isClickable={isClickable}
      margin={margin}
      border={border}
      backgroundColor={backgroundColor}
    >
      <React.Suspense fallback={<></>}>
        <AvatarImage url={src?.url} fallbackUrl={avatarImageFallback} faded={faded} />
      </React.Suspense>
      {active && <ActiveOverlay />}
    </StyledAvatar>
  );
};

export default AppAvatar;

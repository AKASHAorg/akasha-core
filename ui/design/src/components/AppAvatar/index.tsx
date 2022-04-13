import * as React from 'react';
import { AppTypes } from '@akashaorg/ui-awf-typings';

import { AvatarProps } from '../Avatar';
import AvatarImage from '../Avatar/avatar-image';
import StyledAvatar, { ActiveOverlay } from '../Avatar/styled-avatar';

export interface AppAvatarProps extends AvatarProps {
  appType: AppTypes;
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
  let avatarImage: string;

  if (src) {
    avatarImage = src;
  }

  if (!src && appType === AppTypes.APP) {
    // currently there are 3 placeholders for sidebar apps
    avatarImage = `${publicImgPath}/sidebar-app-placeholder-${
      Math.floor(Math.random() * 3) + 1
    }.png`;
  }

  if (!src && appType === AppTypes.WIDGET) {
    // currently there are 2 placeholders for sidebar apps
    avatarImage = `${publicImgPath}/sidebar-widget-placeholder-${
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
        <AvatarImage image={avatarImage} faded={faded} />
      </React.Suspense>
      {active && <ActiveOverlay />}
    </StyledAvatar>
  );
};

export default AppAvatar;

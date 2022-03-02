import * as React from 'react';

import { AvatarProps } from '../Avatar';
import AvatarImage from '../Avatar/avatar-image';
import StyledAvatar, { ActiveOverlay } from '../Avatar/styled-avatar';

export interface AppAvatarProps extends AvatarProps {
  sidebarApp?: boolean;
  sidebarWidget?: boolean;
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
    sidebarApp,
    sidebarWidget,
  } = props;

  const isClickable = typeof onClick === 'function';
  let avatarImage: string;

  if (src) {
    avatarImage = src;
  }

  if (!src && sidebarApp) {
    // currently there are 3 placeholders for sidebar apps
    avatarImage = `${publicImgPath}/sidebar-app-placeholder-${
      Math.floor(Math.random() * 3) + 1
    }.png`;
  }

  if (!src && sidebarWidget) {
    // currently there are 2 placeholders for sidebar apps
    avatarImage = `${publicImgPath}/sidebar-widget-placeholder-${
      Math.floor(Math.random() * 2) + 1
    }.png`;
  }

  return (
    <StyledAvatar
      onClick={onClick}
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      size={size!}
      className={className}
      isClickable={isClickable}
      margin={margin}
      border={border}
    >
      <React.Suspense fallback={<></>}>
        <AvatarImage image={avatarImage} faded={faded} />
      </React.Suspense>
      {active && <ActiveOverlay />}
    </StyledAvatar>
  );
};

export default AppAvatar;

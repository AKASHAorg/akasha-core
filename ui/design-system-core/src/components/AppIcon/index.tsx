import * as React from 'react';
import Stack from '../Stack';
import IconByType from './IconByType';
import { IconType, LogoSourceType } from '@akashaorg/typings/ui';
import { apply, tw } from '@twind/core';
import { BasicIconSize } from '../types/common.types';

export interface IAppIcon {
  ref?: React.Ref<HTMLDivElement>;
  appImg?: LogoSourceType;
  onClick?: React.EventHandler<React.SyntheticEvent>;
  placeholderIconType: IconType;
  accentColor?: boolean;
  // props for notifications icon
  stackedIcon?: boolean;
  hasNewNotifs?: boolean;
  size?: BasicIconSize;
  breakPointSize?: { breakPoint: string; size: BasicIconSize };
  hover?: boolean;
  active?: boolean;
  customStyle?: string;
}

const AppIcon: React.FC<IAppIcon> = React.forwardRef((props, ref) => {
  const {
    appImg,
    onClick,
    placeholderIconType,
    size = 'lg',
    breakPointSize,
    accentColor,
    stackedIcon,
    hasNewNotifs,
    hover,
    active,
    customStyle = '',
  } = props;

  const breakPointStyle = breakPointSize
    ? APP_ICON_CONTAINER_SIZE_MAP_BY_BREAKPOINT(breakPointSize.breakPoint)[breakPointSize.size]
    : '';

  const sizeStyle = `${APP_ICON_CONTAINER_SIZE_MAP[size]} ${breakPointStyle}`;

  const hoverStyle = hover
    ? 'hover:bg-secondary-light/30 dark:hover:bg-secondary-dark group-hover:bg-secondary-light/30 dark:group-hover:bg-secondary-dark'
    : '';

  const activeStyle = active ? 'bg-secondary-light/30 hover:bg-secondary-dark' : '';
  const iconContainerStyle = apply`group relative rounded-full bg-grey9 dark:bg-grey3 ${sizeStyle} ${hoverStyle} ${activeStyle} ${customStyle}`;
  const notifyStyle = NOTIFY_MAP[size];

  if (stackedIcon)
    return (
      <div ref={ref} onClick={onClick}>
        <Stack align="center" justify="center" customStyle={iconContainerStyle}>
          <IconByType
            appImg={appImg}
            size={size}
            breakPointSize={breakPointSize}
            placeholderIconType={placeholderIconType}
            accentColor={accentColor}
            hover={hover}
          />
          {hasNewNotifs && (
            <div className={tw(`rounded-full absolute top-0  bg-secondary-dark ${notifyStyle})`)} />
          )}
        </Stack>
      </div>
    );

  return (
    <div ref={ref} onClick={onClick}>
      <Stack align="center" justify="center" customStyle={iconContainerStyle}>
        <IconByType
          appImg={appImg}
          size={size}
          breakPointSize={breakPointSize}
          placeholderIconType={placeholderIconType}
          accentColor={accentColor}
          hover={hover}
        />
      </Stack>
    </div>
  );
});

const APP_ICON_CONTAINER_SIZE_MAP: Record<BasicIconSize, string> = {
  xs: 'h-3 w-3',
  sm: 'h-5 w-5',
  md: 'h-8 w-8',
  lg: 'h-10 w-10',
  xl: 'h-12 w-12',
};

const APP_ICON_CONTAINER_SIZE_MAP_BY_BREAKPOINT = (
  breakPoint: string,
): Record<BasicIconSize, string> => ({
  xs: `${breakPoint}:h-3 ${breakPoint}:w-3`,
  sm: `${breakPoint}:h-5 ${breakPoint}:w-5`,
  md: `${breakPoint}:h-8 ${breakPoint}:w-8`,
  lg: `${breakPoint}:h-10 ${breakPoint}:w-10`,
  xl: `${breakPoint}:h-12 ${breakPoint}:w-12`,
});

const NOTIFY_MAP: Record<BasicIconSize, string> = {
  xs: 'right-[0.2rem] w-0.5 h-0.5',
  sm: 'right-[0.1875rem] w-1 h-1',
  md: 'right-[0.1875rem] w-2 h-2',
  lg: 'right-[0.125rem] w-3 h-3',
  xl: 'right-1 w-3 h-3',
};

export default AppIcon;

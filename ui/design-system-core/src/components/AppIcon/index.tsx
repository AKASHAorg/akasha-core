import * as React from 'react';
import Stack from '../Stack';
import IconByType from './IconByType';
import { IconType, LogoSourceType } from '@akashaorg/typings/ui';
import { apply, tw } from '@twind/core';
import { BasicIconSize, BreakPointSize } from '../types/common.types';
import { getElevationClasses } from '../../utils/getElevationClasses';

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
  breakPointSize?: BreakPointSize;
  hover?: boolean;
  active?: boolean;
  customStyle?: string;
}

const AppIcon: React.FC<IAppIcon> = React.forwardRef((props, ref) => {
  const {
    appImg,
    onClick,
    placeholderIconType,
    size = 'md',
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
    ? `${`hover:${getElevationClasses('4')}`} ${`group-hover:${getElevationClasses('4')}`}`
    : '';

  const activeStyle = active ? 'bg-secondaryLight/30 hover:bg-secondaryDark' : '';
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
          />
          {hasNewNotifs && (
            <div className={tw(`rounded-full absolute top-0  bg-secondaryDark ${notifyStyle})`)} />
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
        />
      </Stack>
    </div>
  );
});

const APP_ICON_CONTAINER_SIZE_MAP: Record<BasicIconSize, string> = {
  xs: 'h-5 w-5',
  sm: 'h-8 w-8',
  md: 'h-10 w-10',
  lg: 'h-12 w-12',
};

const APP_ICON_CONTAINER_SIZE_MAP_BY_BREAKPOINT = (
  breakPoint: string,
): Record<BasicIconSize, string> => ({
  xs: `${breakPoint}:h-5 ${breakPoint}:w-5`,
  sm: `${breakPoint}:h-8 ${breakPoint}:w-8`,
  md: `${breakPoint}:h-10 ${breakPoint}:w-10`,
  lg: `${breakPoint}:h-12 ${breakPoint}:w-12`,
});

const NOTIFY_MAP: Record<BasicIconSize, string> = {
  xs: 'right-[0.1875rem] w-1 h-1',
  sm: 'right-[0.1875rem] w-2 h-2',
  md: 'right-[0.125rem] w-3 h-3',
  lg: 'right-1 w-3 h-3',
};

export default AppIcon;

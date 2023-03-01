import * as React from 'react';
import Icon, { IconType, iconTypes } from '../Icon';
import Stack from '../Stack';
import { LogoSourceType, LogoTypeSource } from '@akashaorg/typings/ui';
import { apply, tw } from '@twind/core';
import { BasicSize } from '../types/common.types';

export interface IAppIcon {
  ref?: React.Ref<HTMLDivElement>;
  appImg?: LogoSourceType & { value: IconType };
  onClick?: React.EventHandler<React.SyntheticEvent>;
  placeholderIconType: IconType;
  plain?: boolean;
  accentColor?: boolean;
  // props for notifications icon
  stackedIcon?: boolean;
  hasNewNotifs?: boolean;
  size?: BasicSize;
  breakPointSize?: { breakPoint: string; size: BasicSize };
  hover?: boolean;
  active?: boolean;
  className?: string;
}

const AppIcon: React.FC<IAppIcon> = React.forwardRef((props, ref) => {
  const {
    appImg,
    onClick,
    placeholderIconType,
    size = 'md',
    breakPointSize,
    plain,
    accentColor,
    stackedIcon,
    hasNewNotifs,
    hover,
    active,
    className = '',
  } = props;

  const breakPointStyle = breakPointSize
    ? APP_ICON_CONTAINER_SIZE_MAP_BY_BREAKPOINT(breakPointSize.breakPoint)[breakPointSize.size]
    : '';

  const sizeStyle = `${APP_ICON_CONTAINER_SIZE_MAP[size]} ${breakPointStyle}`;

  const renderAppImg = () => {
    if (appImg?.type === LogoTypeSource.ICON && iconTypes.includes(appImg?.value as IconType)) {
      return (
        <Icon
          type={appImg?.value}
          size={size}
          breakPointSize={breakPointSize}
          plain={plain}
          accentColor={accentColor}
        />
      );
    }
    if (appImg?.type === (LogoTypeSource.String || LogoTypeSource.IPFS)) {
      return (
        <img className={tw(`${sizeStyle} rounded-[50%] object-contain`)} src={appImg?.value} />
      );
    }
    return (
      <Icon
        type={placeholderIconType}
        size={size}
        breakPointSize={breakPointSize}
        plain={plain}
        accentColor={accentColor}
      />
    );
  };

  const hoverStyle = hover ? 'hover:bg-secondary-light/30 dark:hover:bg-secondary-dark' : '';
  const activeStyle = active ? 'bg-secondary-light/30 hover:bg-secondary-dark' : '';
  const iconContainerStyle = `${sizeStyle} ${hoverStyle} ${activeStyle} relative rounded-full bg-grey9 dark:bg-grey3 ${className}`;
  const notifyStyle = NOTIFY_MAP[size];

  if (stackedIcon)
    return (
      <div ref={ref} onClick={onClick}>
        <Stack align="center" justify="center" className={tw(apply`${iconContainerStyle}`)}>
          {renderAppImg()}
          {hasNewNotifs && (
            <div
              className={tw(
                apply`w-2 h-2 rounded-full absolute top-0  bg-secondary-dark ${notifyStyle}`,
              )}
            />
          )}
        </Stack>
      </div>
    );

  return (
    <div ref={ref} onClick={onClick}>
      <Stack align="center" justify="center" className={tw(apply`${iconContainerStyle}`)}>
        {renderAppImg()}
      </Stack>
    </div>
  );
});

export const APP_ICON_CONTAINER_SIZE_MAP: Record<BasicSize, string> = {
  xs: 'w-5 w-5',
  sm: 'h-8 w-8',
  md: 'h-10 w-10',
  lg: 'h-12 w-12',
};

export const APP_ICON_CONTAINER_SIZE_MAP_BY_BREAKPOINT = (
  breakPoint: string,
): Record<BasicSize, string> => ({
  xs: `${breakPoint}:w-5 ${breakPoint}:w-5`,
  sm: `${breakPoint}:h-8 ${breakPoint}:w-8`,
  md: `${breakPoint}:h-10 ${breakPoint}:w-10`,
  lg: `${breakPoint}:h-12 ${breakPoint}:w-12`,
});

export const NOTIFY_MAP: Record<BasicSize, string> = {
  xs: 'right-[0.1875rem] w-1 h-1',
  sm: 'right-[0.1875rem]',
  md: 'right-1.5',
  lg: 'right-2',
};

export default AppIcon;

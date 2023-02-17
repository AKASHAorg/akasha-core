import * as React from 'react';
import { tw } from '@twind/core';

import { Stack } from 'grommet';
import { LogoSourceType, LogoTypeSource } from '@akashaorg/typings/ui';

import Icon, { IconType, iconTypes } from '.';

export interface IconSize {
  size?: 'xs' | 'sm' | 'md' | 'lg';
}

export interface IAppIcon extends IconSize {
  ref?: React.Ref<HTMLDivElement>;
  appImg?: LogoSourceType;
  onClick?: React.EventHandler<React.SyntheticEvent>;
  placeholderIconType: IconType;
  plain?: boolean;
  backgroundColor?: string;
  accentColor?: boolean;
  // props for notifications icon
  stackedIcon?: boolean;
  hasNewNotifs?: boolean;
}

const sizesMap = {
  xs: 'w-4 h-4',
  sm: 'w-6 h-6',
  md: 'w-8 h-8',
  lg: 'w-10 h-10',
};

const AppIcon: React.FC<IAppIcon> = React.forwardRef((props, ref) => {
  const {
    appImg,
    onClick,
    placeholderIconType,
    size = 'md',
    plain,
    backgroundColor = 'white',
    accentColor,
    stackedIcon,
    hasNewNotifs,
  } = props;

  const renderAppImg = () => {
    if (appImg?.type === LogoTypeSource.ICON && iconTypes.includes(appImg?.value as IconType)) {
      return <Icon type={appImg?.value} plain={plain} size={size} accentColor={accentColor} />;
    }
    if (appImg?.type === (LogoTypeSource.String || LogoTypeSource.IPFS)) {
      return (
        <img className={tw(`${sizesMap[size]} rounded-[50%] bject-contain`)} src={appImg?.value} />
      );
    }
    return <Icon type={placeholderIconType} plain={plain} accentColor={accentColor} />;
  };

  const className = `flex items-center justify-center ${sizesMap[size]} round-[50%] cursor-pointer bg-${backgroundColor}`;

  if (stackedIcon)
    return (
      <div className={tw(className)} ref={ref} onClick={onClick}>
        {/* @TODO: implement stack with twind */}
        <Stack anchor="top-right">
          {renderAppImg()}
          {hasNewNotifs && <div className={tw('w-2 h-2 rounded-[50%] bg-secondary-dark')} />}
        </Stack>
      </div>
    );

  return (
    <div className={tw(className)} ref={ref} onClick={onClick}>
      {renderAppImg()}
    </div>
  );
});

export { AppIcon };

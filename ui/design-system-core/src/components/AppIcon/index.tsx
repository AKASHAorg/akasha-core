import * as React from 'react';
import { tw } from '@twind/core';

import { LogoSourceType, LogoTypeSource } from '@akashaorg/typings/ui';

import Icon, { IconType, iconTypes } from '../Icon';

export interface IconSize {
  size?: 'xs' | 'sm' | 'md' | 'lg';
}

export interface IAppIcon extends IconSize {
  ref?: React.Ref<HTMLDivElement>;
  appImg?: LogoSourceType;
  onClick?: React.EventHandler<React.SyntheticEvent>;
  placeholderIconType: IconType;
  plain?: boolean;
  accentColor?: boolean;
  isCustomIcon?: boolean;
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
    accentColor,
    stackedIcon,
    isCustomIcon,
    hasNewNotifs,
  } = props;

  const renderAppImg = () => {
    if (appImg?.type === LogoTypeSource.ICON && iconTypes.includes(appImg?.value as IconType)) {
      return (
        <Icon
          type={appImg?.value as IconType}
          plain={plain}
          size={size}
          accentColor={accentColor}
          isCustomIcon={isCustomIcon}
        />
      );
    }
    if (appImg?.type === (LogoTypeSource.String || LogoTypeSource.IPFS)) {
      return (
        <img className={tw(`${sizesMap[size]} rounded-[50%] object-contain`)} src={appImg?.value} />
      );
    }
    return (
      <Icon
        type={placeholderIconType}
        plain={plain}
        accentColor={accentColor}
        isCustomIcon={isCustomIcon}
      />
    );
  };

  const className = `${sizesMap[size]} flex items-center justify-center relative rounded-full bg-grey9 dark:bg-grey3`;

  if (stackedIcon)
    return (
      <div className={tw(className)} ref={ref} onClick={onClick}>
        {renderAppImg()}
        {hasNewNotifs && (
          <div className={tw('w-2 h-2 rounded-full absolute top-0 right-0 bg-secondary-dark')} />
        )}
      </div>
    );

  return (
    <div className={tw(className)} ref={ref} onClick={onClick}>
      {renderAppImg()}
    </div>
  );
});

export default AppIcon;

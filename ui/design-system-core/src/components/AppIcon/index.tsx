import * as React from 'react';
import Icon, { IconType, iconTypes } from '../Icon';
import Stack from '../Stack';
import { LogoSourceType, LogoTypeSource } from '@akashaorg/typings/ui';
import { apply, tw } from '@twind/core';
import { ICON_SIZE_MAP, Size } from '../types/common.types';
import { getWidthClasses } from '../../utils/getWidthClasses';
import { getHeightClasses } from '../../utils/getHeightClasses';

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
  size?: Size;
  iconSize?: Size;
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
    iconSize = 'sm',
    plain,
    accentColor,
    stackedIcon,
    hasNewNotifs,
    hover,
    active,
    className = '',
  } = props;

  const sizeStyle =
    typeof size === 'object'
      ? `${getWidthClasses(size?.width)} ${getHeightClasses(size?.height)}`
      : ICON_SIZE_MAP[size];

  const renderAppImg = () => {
    if (appImg?.type === LogoTypeSource.ICON && iconTypes.includes(appImg?.value as IconType)) {
      return <Icon type={appImg?.value} plain={plain} size={iconSize} accentColor={accentColor} />;
    }
    if (appImg?.type === (LogoTypeSource.String || LogoTypeSource.IPFS)) {
      return (
        <img className={tw(`${sizeStyle} rounded-[50%] object-contain`)} src={appImg?.value} />
      );
    }
    return (
      <Icon type={placeholderIconType} plain={plain} size={iconSize} accentColor={accentColor} />
    );
  };

  const hoverStyle = hover ? 'hover:bg-secondary-light/30 dark:hover:bg-secondary-dark' : '';
  const activeStyle = active ? 'bg-secondary-light/30 hover:bg-secondary-dark' : '';
  const iconContainerStyle = `${sizeStyle} ${hoverStyle} ${activeStyle} relative rounded-full bg-grey9 dark:bg-grey3 ${className}`;

  if (stackedIcon)
    return (
      <div ref={ref} onClick={onClick}>
        <Stack align="center" justify="center" className={tw(apply`${iconContainerStyle}`)}>
          {renderAppImg()}
          {hasNewNotifs && (
            <div className={tw('w-2 h-2 rounded-full absolute top-0 right-0 bg-secondary-dark')} />
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

export default AppIcon;

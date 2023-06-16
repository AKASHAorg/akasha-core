import React from 'react';
import Icon from '../Icon';
import { AppIconProps } from './index';
import { LogoTypeSource } from '@akashaorg/typings/ui';
import { apply, tw } from '@twind/core';

type AppImgProps = {
  appImg: AppIconProps['appImg'];
  size: AppIconProps['size'];
  placeholderIconType: AppIconProps['placeholderIconType'];
  breakPointSize?: AppIconProps['breakPointSize'];
  accentColor?: AppIconProps['accentColor'];
  color?: AppIconProps['iconColor'];
};

const IconByType: React.FC<AppImgProps> = ({
  appImg,
  size,
  placeholderIconType,
  breakPointSize,
  accentColor,
  color,
}) => {
  if (appImg?.type === LogoTypeSource.ICON) {
    return (
      <Icon
        type={appImg?.value}
        size={size}
        breakPointSize={breakPointSize}
        accentColor={accentColor}
        color={color}
      />
    );
  }

  if (appImg?.type === (LogoTypeSource.String || LogoTypeSource.IPFS)) {
    return <img className={tw(apply`rounded-[50%] object-contain`)} src={appImg?.value} />;
  }
  return (
    <Icon
      type={placeholderIconType}
      size={size}
      breakPointSize={breakPointSize}
      accentColor={accentColor}
      color={color}
    />
  );
};

export default IconByType;

import React from 'react';
import Icon from '../Icon';
import { IAppIcon } from './index';
import { LogoTypeSource } from '@akashaorg/typings/ui';
import { apply, tw } from '@twind/core';

type AppImgProps = {
  appImg: IAppIcon['appImg'];
  size: IAppIcon['size'];
  placeholderIconType: IAppIcon['placeholderIconType'];
  breakPointSize?: IAppIcon['breakPointSize'];
  accentColor?: IAppIcon['accentColor'];
  hover?: boolean;
};

const IconByType: React.FC<AppImgProps> = ({
  appImg,
  size,
  placeholderIconType,
  breakPointSize,
  accentColor,
  hover,
}) => {
  if (appImg?.type === LogoTypeSource.ICON) {
    return (
      <Icon
        type={appImg?.value}
        size={size}
        breakPointSize={breakPointSize}
        accentColor={accentColor}
        hover={hover}
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
      hover={hover}
    />
  );
};

export default IconByType;

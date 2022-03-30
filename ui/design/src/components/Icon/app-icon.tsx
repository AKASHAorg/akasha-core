import * as React from 'react';
import { LogoSourceType, LogoTypeSource } from '@akashaproject/ui-awf-typings';

import Icon, { IconType, iconTypes } from '.';
import { StyledIconDiv, StyledImage } from './styled-icon';

export interface IAppIcon extends IconSize {
  ref?: React.Ref<HTMLDivElement>;
  appImg?: LogoSourceType;
  onClick?: React.EventHandler<React.SyntheticEvent>;
  placeholderIconType: IconType;
  plain?: boolean;
  backgroundColor?: string;
  accentColor?: boolean;
}

export interface IconSize {
  size?: 'xs' | 'sm' | 'md' | 'lg';
}

const AppIcon: React.FC<IAppIcon> = React.forwardRef((props, ref) => {
  const { appImg, onClick, placeholderIconType, size, plain, backgroundColor, accentColor } = props;

  const renderAppImg = () => {
    if (appImg?.type === LogoTypeSource.ICON && iconTypes.includes(appImg?.value as IconType)) {
      return <Icon type={appImg?.value} plain={plain} size={size} accentColor={accentColor} />;
    }
    if (appImg?.type === (LogoTypeSource.String || LogoTypeSource.IPFS)) {
      return <StyledImage src={appImg?.value} fit="contain" size={size} />;
    }
    return <Icon type={placeholderIconType} plain={plain} accentColor={accentColor} />;
  };
  return (
    <StyledIconDiv onClick={onClick} ref={ref} size={size} backgroundColor={backgroundColor}>
      {renderAppImg()}
    </StyledIconDiv>
  );
});

export { AppIcon };

import * as React from 'react';
import Icon, { IconType, iconTypes } from '.';
import { StyledIconDiv, StyledImage } from './styled-icon';
import { LogoSourceType, LogoTypeSource } from '@akashaproject/ui-awf-typings';

export interface IAppIcon extends IconSize {
  ref?: React.Ref<HTMLDivElement>;
  appImg?: LogoSourceType;
  onClick?: React.EventHandler<React.SyntheticEvent>;
  placeholderIconType: IconType;
}

export interface IconSize {
  size?: 'xs' | 'sm' | 'md' | 'lg';
}

const AppIcon: React.FC<IAppIcon> = React.forwardRef((props, ref) => {
  const { appImg, onClick, placeholderIconType, size } = props;
  const renderAppImg = () => {
    if (appImg?.type === LogoTypeSource.ICON && iconTypes.includes(appImg?.value as IconType)) {
      return <Icon type={appImg?.value} size={size} />;
    }
    if (appImg?.type === (LogoTypeSource.String || LogoTypeSource.IPFS)) {
      return <StyledImage src={appImg?.value} fit="contain" size={size} />;
    }
    return <Icon type={placeholderIconType} />;
  };
  return (
    <StyledIconDiv onClick={onClick} ref={ref} size={size}>
      {renderAppImg()}
    </StyledIconDiv>
  );
});

export { AppIcon };

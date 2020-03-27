import * as React from 'react';
import { Icon, IconType, iconTypes } from './icon';
import { StyledIconDiv, StyledImage } from './styled-icon';

export interface IAppIcon extends IconSize {
  ref?: React.Ref<HTMLDivElement>;
  appImg?: string;
  onClick?: () => void;
  placeholderIconType: IconType;
}

export interface IconSize {
  size?: 'sm' | 'md' | 'lg';
}

const AppIcon: React.FC<IAppIcon> = React.forwardRef((props, ref) => {
  const { appImg, onClick, placeholderIconType, size } = props;
  const renderAppImg = () => {
    if (!appImg) {
      return <Icon type={placeholderIconType} />;
    }
    if (iconTypes.includes(appImg as IconType)) {
      return <Icon type={appImg} />;
    }
    return <StyledImage src={appImg} fit="contain" size={size} />;
  };
  return (
    <StyledIconDiv onClick={onClick} ref={ref} size={size}>
      {renderAppImg()}
    </StyledIconDiv>
  );
});

export { AppIcon };

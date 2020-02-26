import * as React from 'react';
import { Icon, IconType } from './icon';
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
  return (
    <StyledIconDiv onClick={onClick} ref={ref} size={size}>
      {appImg ? (
        <StyledImage src={appImg} fit="contain" size={size} />
      ) : (
        <Icon type={placeholderIconType} />
      )}
    </StyledIconDiv>
  );
});

export { AppIcon };

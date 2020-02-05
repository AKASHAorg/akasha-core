import * as React from 'react';
import { Icon, IconType } from './icon';
import { StyledIconDiv, StyledImage } from './styled-icon';

export interface IAppIcon {
  ref: React.Ref<HTMLDivElement>;
  appImg?: string;
  onClick?: () => void;
  placeholderIconType: IconType;
}

const AppIcon: React.FC<IAppIcon> = React.forwardRef((props, ref) => {
  const { appImg, onClick, placeholderIconType } = props;
  return (
    <StyledIconDiv onClick={onClick} ref={ref}>
      {appImg ? <StyledImage src={appImg} fit="contain" /> : <Icon type={placeholderIconType} />}
    </StyledIconDiv>
  );
});

export { AppIcon };

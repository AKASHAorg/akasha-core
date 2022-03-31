import * as React from 'react';
import styled from 'styled-components';

import Icon from '../../Icon';
import Avatar from '../../Avatar';
import ImageOverlay from '../../ImageOverlay';
import { AvatarBorderSize, AvatarSize } from '../../Avatar/styled-avatar';

type Size = 'xl' | 'xxs' | 'xs' | 'sm' | 'md' | 'lg';

export interface ICDetailCardAvatarProps {
  avatar?: string;
  avatarSize?: AvatarSize;
  avatarBorder?: AvatarBorderSize;
  ethAddress?: string;
  iconType?: string;
  iconSize?: Size;
}

const boxSizeDimensions = {
  xl: '4.5rem',
  lg: '4rem',
  md: '3.5rem',
  sm: '3rem',
  xs: '2.5rem',
  xxs: '2rem',
};

const StyledBackgroundDiv = styled.div<{ boxSize: Size }>`
  border-radius: 4px;
  width: ${props => boxSizeDimensions[props.boxSize]};
  height: ${props => boxSizeDimensions[props.boxSize]};
  background: ${props => props.theme.colors.beigeBackground};
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ICDetailCardAvatar: React.FC<ICDetailCardAvatarProps> = props => {
  const {
    avatar,
    avatarSize = 'xxl',
    avatarBorder = 'lg',
    ethAddress,
    iconType = 'integrationAppLarge',
    iconSize = 'xl',
  } = props;

  const [imageOverlayOpen, setImageOverlayOpen] = React.useState(false);

  const handleClickImage = () => {
    setImageOverlayOpen(true);
  };

  const closeImageOverlay = () => {
    setImageOverlayOpen(false);
  };

  return (
    <>
      {/* if avatar is passed */}
      {avatar && (
        <Avatar
          size={avatarSize}
          border={avatarBorder}
          ethAddress={ethAddress}
          src={avatar}
          onClick={handleClickImage}
        />
      )}
      {/* fallback, if no avatar */}
      {!avatar && (
        <StyledBackgroundDiv boxSize={iconSize}>
          <Icon type={iconType} size={iconSize} plain={true} />
        </StyledBackgroundDiv>
      )}
      {imageOverlayOpen && avatar && (
        <ImageOverlay imgUrl={avatar} closeModal={closeImageOverlay} />
      )}
    </>
  );
};

export default ICDetailCardAvatar;

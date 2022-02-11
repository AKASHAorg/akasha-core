import * as React from 'react';
import styled from 'styled-components';
import Icon from '../../Icon';
import Avatar from '../../Avatar';
import ImageOverlay from '../../ImageOverlay';
import { AvatarDiv } from '../../ProfileCard/styled-profile-card';

export interface ICDetailCardAvatarProps {
  avatar?: string;
  ethAddress?: string;
}

const StyledBackgroundDiv = styled.div`
  border-radius: 4px;
  width: 4.5rem;
  height: 4.5rem;
  background: ${props => props.theme.colors.beigeBackground};
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ICDetailCardAvatar: React.FC<ICDetailCardAvatarProps> = props => {
  const { avatar, ethAddress } = props;

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
        <AvatarDiv>
          <Avatar
            size="xxl"
            border="lg"
            ethAddress={ethAddress}
            src={avatar}
            onClick={handleClickImage}
          />
        </AvatarDiv>
      )}
      {/* fallback, if no avatar */}
      {!avatar && (
        <StyledBackgroundDiv>
          <Icon type="integrationAppLarge" size="xl" />
        </StyledBackgroundDiv>
      )}
      {imageOverlayOpen && avatar && (
        <ImageOverlay imgUrl={avatar} closeModal={closeImageOverlay} />
      )}
    </>
  );
};

export default ICDetailCardAvatar;

import * as React from 'react';
import { StyledIconBox } from '../../AppInfoWidgetCard/styled-widget-cards';

import Icon from '../../Icon';
import Avatar from '../../Avatar';
import ImageOverlay from '../../ImageOverlay';
import { AvatarDiv } from '../../ProfileCard/styled-profile-card';

export interface ICDetailCardAvatarProps {
  avatar?: string;
  ethAddress?: string;
}

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
        <StyledIconBox
          style={{
            width: '4rem',
            height: '4rem',
            marginRight: '0.5rem',
            position: 'relative',
            top: '-0.5rem',
          }}
        >
          <Icon type="appIC" size="xl" />
        </StyledIconBox>
      )}
      {imageOverlayOpen && avatar && (
        <ImageOverlay imgUrl={avatar} closeModal={closeImageOverlay} />
      )}
    </>
  );
};

export default ICDetailCardAvatar;

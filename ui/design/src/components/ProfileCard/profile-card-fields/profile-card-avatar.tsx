import * as React from 'react';
import { IProfileData } from '@akashaorg/typings/ui';
import Avatar from '../../Avatar';
import ImageOverlay from '../../ImageOverlay';
import { AvatarDiv } from '../styled-profile-card';
import { AvatarBorderColor } from '../../Avatar/styled-avatar';

export type IProfileCardAvatarProps = {
  avatar?: IProfileData['avatar'];
  avatarBorderColor?: AvatarBorderColor;
  ethAddress?: string;
};

const ProfileCardAvatar: React.FC<IProfileCardAvatarProps> = props => {
  const { avatar, avatarBorderColor, ethAddress } = props;

  const [imageOverlayOpen, setImageOverlayOpen] = React.useState(false);

  const handleClickImage = () => {
    setImageOverlayOpen(true);
  };

  const closeImageOverlay = () => {
    setImageOverlayOpen(false);
  };

  return (
    <>
      <AvatarDiv>
        <Avatar
          size="xxl"
          border="lg"
          ethAddress={ethAddress}
          src={avatar}
          onClick={handleClickImage}
          borderColor={avatarBorderColor}
        />
      </AvatarDiv>
      {imageOverlayOpen && avatar && <ImageOverlay src={avatar} closeModal={closeImageOverlay} />}
    </>
  );
};

export default ProfileCardAvatar;

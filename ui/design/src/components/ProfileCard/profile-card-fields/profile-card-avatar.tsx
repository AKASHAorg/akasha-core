import * as React from 'react';
import Avatar from '../../Avatar';
import ImageOverlay from '../../ImageOverlay';
import { AvatarDiv } from '../styled-profile-card';
import { AvatarBorderColor } from '../../Avatar/styled-avatar';
import { Profile } from '@akashaorg/typings/sdk/graphql-types-new';

export type IProfileCardAvatarProps = {
  avatar?: Profile['avatar'];
  avatarBorderColor?: AvatarBorderColor;
  profileId?: string;
};

const ProfileCardAvatar: React.FC<IProfileCardAvatarProps> = props => {
  const { avatar, avatarBorderColor, profileId } = props;

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
          profileId={profileId}
          avatar={avatar}
          onClick={handleClickImage}
          borderColor={avatarBorderColor}
        />
      </AvatarDiv>
      {imageOverlayOpen && avatar && (
        <ImageOverlay src={avatar.default.src} closeModal={closeImageOverlay} />
      )}
    </>
  );
};

export default ProfileCardAvatar;

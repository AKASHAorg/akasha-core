import { Image } from 'grommet';
import * as React from 'react';
import { getEditableImageFieldHandlers } from '../../../utils/get-editable-field-handlers';
import { IProfileData } from '../profile-widget-card';
import { AvatarDiv, StyledImageInput } from '../styled-profile-card';

export interface IProfileCardAvatarProps {
  profileData: IProfileData;
  editable: boolean;
  onChangeProfileData: (newProfileData: IProfileData) => void;
}

const ProfileCardAvatar: React.FC<IProfileCardAvatarProps> = props => {
  const { profileData, editable, onChangeProfileData } = props;

  const [newAvatar, setNewAvatar] = React.useState(profileData.avatar);
  const avatarRef = React.useRef(null);
  const { handleClick, handleChange } = getEditableImageFieldHandlers(
    editable,
    avatarRef,
    setNewAvatar,
    (newValue: string) =>
      onChangeProfileData({
        ...profileData,
        avatar: newValue,
      }),
  );

  return (
    <AvatarDiv onClick={handleClick}>
      {newAvatar && (
        <Image
          src={newAvatar}
          alt="Avatar"
          fit="cover"
          width="76px"
          height="76px"
          style={{ borderRadius: '100%' }}
        />
      )}

      <StyledImageInput ref={avatarRef} name="avatar" type="file" onChange={handleChange} />
    </AvatarDiv>
  );
};

export default ProfileCardAvatar;

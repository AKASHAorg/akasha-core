import { Box } from 'grommet';
import * as React from 'react';
import { getEditableImageFieldHandlers } from '../../../../utils/get-editable-field-handlers';
import { IconButton } from '../../../Buttons/index';
import { Icon } from '../../../Icon';
import { IProfileData } from '../profile-widget-card';
import { ShareButtonContainer, StyledImageInput } from '../styled-profile-card';

export interface IProfileCardCoverImageProps {
  shareProfileText: string;
  editProfileText: string;
  profileData: IProfileData;
  editable: boolean;
  onChangeProfileData: (newProfileData: IProfileData) => void;
}

const ProfileCardCoverImage: React.FC<IProfileCardCoverImageProps> = props => {
  const { shareProfileText, editProfileText, profileData, editable, onChangeProfileData } = props;

  const [newCoverImage, setNewCoverImage] = React.useState(profileData.coverImage);
  const coverImageRef = React.useRef(null);
  const { handleClick, handleChange } = getEditableImageFieldHandlers(
    editable,
    coverImageRef,
    setNewCoverImage,
    (newValue: string) =>
      onChangeProfileData({
        ...profileData,
        coverImage: newValue,
      }),
  );

  return (
    <Box
      height="144px"
      background={newCoverImage!.startsWith('data:') ? `url(${newCoverImage})` : newCoverImage}
      pad="none"
      round={{ corner: 'top', size: 'xsmall' }}
      align="end"
      onClick={handleClick}
    >
      <ShareButtonContainer gap="xsmall" direction="row">
        <IconButton
          secondary={true}
          icon={<Icon type="editSimple" color="white" />}
          label={editProfileText}
        />
        <IconButton
          secondary={true}
          icon={<Icon type="reply" color="white" />}
          label={shareProfileText}
        />
      </ShareButtonContainer>

      <StyledImageInput
        data-testid="profile-card-cover-image"
        ref={coverImageRef}
        name="coverImage"
        type="file"
        onChange={handleChange}
      />
    </Box>
  );
};

export default ProfileCardCoverImage;

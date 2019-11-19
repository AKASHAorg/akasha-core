import { Box } from 'grommet';
import * as React from 'react';

import { getEditableImageFieldHandlers } from '../../../utils/get-editable-field-handlers';
import { Icon } from '../../Icon';
import IconButton from '../../IconButton/icon-button';
import { IProfileData } from '../profile-card';
import { ShareButtonContainer, StyledImageInput } from '../styled-profile-card';

export interface IProfileCardCoverImageProps {
  shareProfileText: string;
  profileData: IProfileData;
  editable: boolean;
  onChangeProfileData: (newProfileData: IProfileData) => void;
}

const ProfileCardCoverImage: React.FC<IProfileCardCoverImageProps> = props => {
  const { shareProfileText, profileData, editable, onChangeProfileData } = props;

  const [newCoverImage, setNewCoverImage] = React.useState(profileData.coverImage);
  const coverImageRef: React.MutableRefObject<HTMLInputElement> = React.useRef();
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
      background={newCoverImage.startsWith('data:') ? `url(${newCoverImage})` : newCoverImage}
      pad="none"
      round={{ corner: 'top', size: 'xsmall' }}
      align="end"
      onClick={handleClick}
    >
      <ShareButtonContainer>
        <IconButton share={true} icon={<Icon type="share" />} label={shareProfileText} />
      </ShareButtonContainer>

      <StyledImageInput ref={coverImageRef} name="coverImage" type="file" onChange={handleChange} />
    </Box>
  );
};

export default ProfileCardCoverImage;

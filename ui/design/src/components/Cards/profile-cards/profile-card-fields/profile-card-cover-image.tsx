import { Box, Text } from 'grommet';
import * as React from 'react';
import { IconButton } from '../../../Buttons/index';
import { Icon } from '../../../Icon';
import { SelectPopover } from '../../../Popovers/index';
import { IProfileDataProvider, IProfileProvidersData } from '../profile-card';
import { ShareButtonContainer, StyledEditCoverImageBox } from '../styled-profile-card';
import { EditFieldIcon } from './ edit-field-icon';

export interface IProfileCardCoverImageProps {
  shareProfileLabel: string;
  editProfileLabel: string;
  changeCoverImageLabel: string;
  editable: boolean;
  coverImage?: string;
  coverImageIcon?: string;
  handleChangeCoverImage: (provider: IProfileDataProvider) => void;
  coverImagePopoverOpen: boolean;
  setCoverImagePopoverOpen: (value: boolean) => void;
  handleEditClick: () => void;
  handleShareClick: () => void;
  profileProvidersData?: IProfileProvidersData;
}

const ProfileCardCoverImage: React.FC<IProfileCardCoverImageProps> = props => {
  const {
    shareProfileLabel,
    editProfileLabel,
    changeCoverImageLabel,
    editable,
    coverImage,
    coverImageIcon,
    handleChangeCoverImage,
    handleEditClick,
    handleShareClick,
    coverImagePopoverOpen,
    setCoverImagePopoverOpen,
    profileProvidersData,
  } = props;

  const editCoverImageRef: React.RefObject<HTMLDivElement> = React.useRef(null);

  return (
    <Box
      height="9em"
      background={coverImage!.startsWith('data:') ? `url(${coverImage})` : coverImage}
      pad="none"
      round={{ corner: 'top', size: 'xsmall' }}
    >
      {!editable && (
        <Box align="end" pad="none">
          <ShareButtonContainer gap="xsmall" direction="row">
            <IconButton
              secondary={true}
              icon={<Icon type="editSimple" color="white" />}
              label={editProfileLabel}
              onClick={handleEditClick}
            />
            <IconButton
              secondary={true}
              icon={<Icon type="reply" color="white" />}
              label={shareProfileLabel}
              onClick={handleShareClick}
            />
          </ShareButtonContainer>
        </Box>
      )}
      {editable &&
        profileProvidersData &&
        profileProvidersData.coverImageProviders &&
        profileProvidersData.coverImageProviders.length !== 0 && (
          <Box justify="center" fill="vertical">
            <StyledEditCoverImageBox
              direction="row"
              gap="xsmall"
              justify="center"
              onClick={() => setCoverImagePopoverOpen(true)}
            >
              <Text size="medium" color="white">
                {changeCoverImageLabel}
              </Text>
              <EditFieldIcon
                ref={editCoverImageRef}
                popoverHandler={() => setCoverImagePopoverOpen(true)}
                providerIcon={coverImageIcon}
              />
            </StyledEditCoverImageBox>
          </Box>
        )}
      {editCoverImageRef.current &&
        coverImagePopoverOpen &&
        profileProvidersData &&
        profileProvidersData.coverImageProviders &&
        profileProvidersData.coverImageProviders.length !== 0 && (
          <SelectPopover
            currentValue={coverImage}
            target={editCoverImageRef.current}
            dataSource={profileProvidersData.coverImageProviders}
            onClickElem={handleChangeCoverImage}
            closePopover={() => {
              setCoverImagePopoverOpen(false);
            }}
          />
        )}
    </Box>
  );
};

export default ProfileCardCoverImage;

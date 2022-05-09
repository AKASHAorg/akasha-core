import { Box, Text } from 'grommet';
import * as React from 'react';
import IconButton from '../../IconButton';
import Icon from '../../Icon';
import { AppIcon } from '../../Icon/app-icon';
import SelectPopover from '../../SelectPopover';
import { IProfileDataProvider, IProfileProvidersData } from '../';
import { ShareButtonContainer, StyledEditCoverImageBox } from '../styled-profile-card';
import { LogoSourceType } from '@akashaorg/ui-awf-typings/lib/index';
import ImageOverlay from '../../ImageOverlay';
import { IProfileData } from '@akashaorg/ui-awf-typings/lib/profile';

export interface IProfileCardCoverImageProps {
  shareProfileLabel: string;
  changeCoverImageLabel?: string;
  editable: boolean;
  canUserEdit?: boolean;
  coverImage?: IProfileData['coverImage'];
  coverImageIcon?: LogoSourceType;
  handleChangeCoverImage: (provider: IProfileDataProvider) => void;
  coverImagePopoverOpen: boolean;
  setCoverImagePopoverOpen: (value: boolean) => void;
  handleShareClick: () => void;
  profileProvidersData?: IProfileProvidersData;
}

const ProfileCardCoverImage: React.FC<IProfileCardCoverImageProps> = props => {
  const {
    shareProfileLabel,
    changeCoverImageLabel,
    editable,
    coverImage,
    coverImageIcon,
    handleChangeCoverImage,
    handleShareClick,
    coverImagePopoverOpen,
    setCoverImagePopoverOpen,
    profileProvidersData,
  } = props;

  const editCoverImageRef: React.RefObject<HTMLDivElement> = React.useRef(null);

  const [imageOverlayOpen, setImageOverlayOpen] = React.useState(false);

  const handleClickImage = () => {
    setImageOverlayOpen(true);
  };

  const closeImageOverlay = () => {
    setImageOverlayOpen(false);
  };

  return (
    <Box
      height="9rem"
      background={{
        color: 'coverImageBackground',
        image: `url(${coverImage.url || coverImage.fallbackUrl})`,
        repeat: 'no-repeat',
        size: 'cover',
      }}
      pad="none"
      round={{ corner: 'top', size: 'xsmall' }}
      onClick={handleClickImage}
      data-testid="profile-card-cover-image"
    >
      {imageOverlayOpen && coverImage && (
        <ImageOverlay src={coverImage} closeModal={closeImageOverlay} />
      )}
      {/* disable sharing for v.01 */}
      {false && !editable && (
        <Box align="end" pad="none">
          <ShareButtonContainer gap="xsmall" direction="row">
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
              align="center"
              onClick={() => setCoverImagePopoverOpen(!coverImagePopoverOpen)}
            >
              <Text size="medium" color="white">
                {changeCoverImageLabel}
              </Text>
              <AppIcon
                ref={editCoverImageRef}
                onClick={() => setCoverImagePopoverOpen(!coverImagePopoverOpen)}
                appImg={coverImageIcon}
                placeholderIconType="editSimple"
                size="xs"
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
            currentValue={coverImage.url}
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

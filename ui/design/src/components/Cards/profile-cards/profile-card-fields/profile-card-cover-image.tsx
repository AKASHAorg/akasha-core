import { Box, Text } from 'grommet';
import * as React from 'react';
import { IconButton } from '../../../Buttons/index';
import { Icon } from '../../../Icon';
import { AppIcon } from '../../../Icon/index';
import { SelectPopover } from '../../../Popovers/index';
import { IProfileDataProvider, IProfileProvidersData } from '../profile-card';
import { ShareButtonContainer, StyledEditCoverImageBox } from '../styled-profile-card';
import { LogoSourceType } from '@akashaproject/ui-awf-typings/lib/index';

export interface IProfileCardCoverImageProps {
  shareProfileLabel: string;
  changeCoverImageLabel: string;
  editable: boolean;
  canUserEdit?: boolean;
  coverImage?: string;
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

  return (
    <Box
      height="9em"
      background={`#DDD url(${coverImage})`}
      pad="none"
      round={{ corner: 'top', size: 'xsmall' }}
    >
      {!editable && (
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

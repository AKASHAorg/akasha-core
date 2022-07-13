import * as React from 'react';
import { LogoSourceType } from '@akashaorg/ui-awf-typings/lib/index';
import { IProfileData } from '@akashaorg/ui-awf-typings/lib/profile';

import { IProfileDataProvider, IProfileProvidersData } from '../';

import Avatar from '../../Avatar';
import { AppIcon } from '../../Icon/app-icon';
import ImageOverlay from '../../ImageOverlay';
import SelectPopover from '../../SelectPopover';

import { AvatarDiv, StyledAvatarEditDiv } from '../styled-profile-card';
import { AvatarBorderColor } from '../../Avatar/styled-avatar';

export interface IProfileCardAvatarProps {
  editable: boolean;
  avatar?: IProfileData['avatar'];
  avatarIcon?: LogoSourceType;
  avatarBorderColor?: AvatarBorderColor;
  avatarPopoverOpen: boolean;
  setAvatarPopoverOpen: (value: boolean) => void;
  handleChangeAvatar: (provider: IProfileDataProvider) => void;
  profileProvidersData?: IProfileProvidersData;
  ethAddress?: string;
}

const ProfileCardAvatar: React.FC<IProfileCardAvatarProps> = props => {
  const {
    editable,
    avatar,
    avatarIcon,
    avatarBorderColor,
    avatarPopoverOpen,
    setAvatarPopoverOpen,
    profileProvidersData,
    ethAddress,
    handleChangeAvatar,
  } = props;

  const editAvatarRef: React.RefObject<HTMLDivElement> = React.useRef(null);

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
        {editable &&
          profileProvidersData &&
          profileProvidersData.avatarProviders &&
          profileProvidersData.avatarProviders.length !== 0 && (
            <StyledAvatarEditDiv>
              <AppIcon
                ref={editAvatarRef}
                onClick={() => setAvatarPopoverOpen(!avatarPopoverOpen)}
                appImg={avatarIcon}
                placeholderIconType="editSimple"
                size="xs"
              />
            </StyledAvatarEditDiv>
          )}
      </AvatarDiv>
      {imageOverlayOpen && avatar && <ImageOverlay src={avatar} closeModal={closeImageOverlay} />}
      {editAvatarRef.current &&
        avatarPopoverOpen &&
        profileProvidersData &&
        profileProvidersData.avatarProviders &&
        profileProvidersData.avatarProviders.length !== 0 && (
          <SelectPopover
            currentValue={avatar.fallbackUrl}
            target={editAvatarRef.current}
            dataSource={profileProvidersData.avatarProviders}
            onClickElem={handleChangeAvatar}
            closePopover={() => {
              setAvatarPopoverOpen(false);
            }}
          />
        )}
    </>
  );
};

export default ProfileCardAvatar;

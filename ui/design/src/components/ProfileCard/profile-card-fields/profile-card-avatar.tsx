import * as React from 'react';
import Avatar from '../../Avatar';
import { AppIcon } from '../../Icon/app-icon';
import SelectPopover from '../../SelectPopover';
import { IProfileDataProvider, IProfileProvidersData } from '../';
import { AvatarDiv, StyledAvatarEditDiv } from '../styled-profile-card';
import { LogoSourceType } from '@akashaproject/ui-awf-typings/lib/index';
import ImageOverlay from '../../ImageOverlay';

export interface IProfileCardAvatarProps {
  editable: boolean;
  avatar?: string;
  avatarIcon?: LogoSourceType;
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
      {imageOverlayOpen && avatar && (
        <ImageOverlay imgUrl={avatar} closeModal={closeImageOverlay} />
      )}
      {editAvatarRef.current &&
        avatarPopoverOpen &&
        profileProvidersData &&
        profileProvidersData.avatarProviders &&
        profileProvidersData.avatarProviders.length !== 0 && (
          <SelectPopover
            currentValue={avatar}
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

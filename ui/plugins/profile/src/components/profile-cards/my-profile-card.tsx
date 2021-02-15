import * as React from 'react';
import DS from '@akashaproject/design-system';
import { IProfileData } from '@akashaproject/design-system/lib/components/Cards/profile-cards/profile-widget-card';
import { useTranslation } from 'react-i18next';
import { MODAL_NAMES } from '@akashaproject/ui-awf-hooks/lib/use-modal-state';

const { ProfileCard, ShareModal, styled } = DS;

const Overlay = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  inset: 0;
  opacity: 1;
  background-color: ${props => props.theme.colors.modalBackground};
  animation: fadeAnimation ease 0.4s;
  animation-iteration-count: 1;
  animation-fill-mode: forwards;
`;

interface MPPHeaderProps {
  profileData: Partial<IProfileData>;
  onModalShow: (modalName: string) => void;
  canEdit: boolean;
  userName: string | null;
  shareUrl: string;
  onShareModalClose: () => void;
  onShare: () => void;
  // profileModalName: string;
  // shareProfileModalName: string;
  // ensModalName: string;
  modalState: { [key: string]: boolean };
}

export const MyProfileCard = (props: MPPHeaderProps) => {
  const { profileData, onShare, onShareModalClose, shareUrl } = props;
  const { t } = useTranslation();
  if (!profileData) {
    return null;
  }

  const showUpdateProfileModal = () => {
    props.onModalShow(MODAL_NAMES.PROFILE_UPDATE);
  };

  const showEnsModal = () => {
    props.onModalShow(MODAL_NAMES.CHANGE_ENS);
  };

  const showShareModal = () => {
    props.onModalShow(MODAL_NAMES.PROFILE_SHARE);
  };

  return (
    <>
      {props.modalState[MODAL_NAMES.PROFILE_SHARE] && (
        <Overlay>
          <ShareModal link={shareUrl} handleProfileShare={onShare} closeModal={onShareModalClose} />
        </Overlay>
      )}
      <ProfileCard
        //@todo: fix props to be optional
        flagAsLabel={''}
        onEntryFlag={() => {}}
        onClickFollowing={() => {}}
        profileData={profileData as any}
        canUserEdit={props.canEdit}
        onChangeProfileData={() => {}}
        getProfileProvidersData={() => {}}
        descriptionLabel={t('About me')}
        editProfileLabel={t('Edit profile')}
        updateProfileLabel={t('Update profile')}
        changeCoverImageLabel={t('Change cover image')}
        cancelLabel={t('Cancel')}
        saveChangesLabel={t('Save changes')}
        followingLabel={t('Following')}
        followersLabel={t('Followers')}
        postsLabel={t('Posts')}
        shareProfileLabel={t('Share Profile')}
        flaggable={false}
        handleShareClick={showShareModal}
        onUpdateClick={showUpdateProfileModal}
        onENSChangeClick={showEnsModal}
        changeENSLabel={t('Change Ethereum name')}
        hideENSButton={!!props.userName}
      />
    </>
  );
};

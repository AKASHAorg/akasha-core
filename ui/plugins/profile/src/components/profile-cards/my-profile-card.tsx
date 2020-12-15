import * as React from 'react';
import DS from '@akashaproject/design-system';
import { IProfileData } from '@akashaproject/design-system/lib/components/Cards/profile-cards/profile-widget-card';
import { useTranslation } from 'react-i18next';
import { ModalState, ModalStateActions } from '@akashaproject/ui-awf-hooks/lib/use-modal-state';

const { ProfileCard } = DS;

interface MPPHeaderProps {
  profileData: Partial<IProfileData>;
  modalState: ModalState;
  modalActions: ModalStateActions
  canEdit: boolean;
}

export const MyProfileCard = (props: MPPHeaderProps) => {
  const { profileData } = props;
  const { t } = useTranslation();
  if (!profileData) {
    return null;
  }

  const showUpdateProfileModal = () => {
    props.modalActions.show('updateProfile')
  }

  const showEnsModal = () => {
    props.modalActions.show('changeENS');
  }

  return (
    <ProfileCard
      onClickApps={() => {}}
      onClickFollowing={() => {}}
      //@ts-ignore
      profileData={profileData}
      canUserEdit={props.canEdit}
      onChangeProfileData={() => {}}
      getProfileProvidersData={() => {}}
      descriptionLabel={t('About me')}
      actionsLabel={t('Actions')}
      editProfileLabel={t('Edit profile')}
      updateProfileLabel={t('Update profile')}
      changeUsernameLabel={t('Change username')}
      changeEthereumNameLabel={t('Change Ethereum name')}
      changeCoverImageLabel={t('Change cover image')}
      cancelLabel={t('Cancel')}
      saveChangesLabel={t('Save changes')}
      followingLabel={t('Following')}
      appsLabel={t('Apps')}
      usersLabel={t('Users')}
      shareProfileLabel={t('Share Profile')}
      flaggable={false}
      onUpdateClick={showUpdateProfileModal}
      onENSChangeClick={showEnsModal}
      changeENSLabel={t('Change Ethereum name')}
    />
  );
};

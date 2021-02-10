import * as React from 'react';
import DS from '@akashaproject/design-system';
import { IProfileData } from '@akashaproject/design-system/lib/components/Cards/profile-cards/profile-widget-card';
import { useTranslation } from 'react-i18next';

const { ProfileCard } = DS;

interface MPPHeaderProps {
  profileData: Partial<IProfileData>;
  onModalShow: (modalName: string) => void;
  canEdit: boolean;
  userName: string | null;
  profileModalName: string;
  shareProfileModalName: string;
  ensModalName: string;
}

export const MyProfileCard = (props: MPPHeaderProps) => {
  const { profileData, profileModalName, ensModalName, shareProfileModalName } = props;
  const { t } = useTranslation();
  if (!profileData) {
    return null;
  }

  const showUpdateProfileModal = () => {
    props.onModalShow(profileModalName);
  };

  const showEnsModal = () => {
    props.onModalShow(ensModalName);
  };

  const showShareModal = () => {
    props.onModalShow(shareProfileModalName);
  };

  return (
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
  );
};

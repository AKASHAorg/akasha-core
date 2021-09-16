import * as React from 'react';
import { useTranslation } from 'react-i18next';

import DS from '@akashaproject/design-system';
import { RootComponentProps } from '@akashaproject/ui-awf-typings';
import { IProfileData, UsernameTypes } from '@akashaproject/ui-awf-typings/lib/profile';
import {
  useIsFollowing,
  useFollow,
  useUnfollow,
} from '@akashaproject/ui-awf-hooks/lib/use-follow.new';
import { ILoginState } from '@akashaproject/ui-awf-hooks/lib/use-login-state';

import StatModalWrapper from './stat-modal-wrapper';
import { getUsernameTypes } from '../../utils/username-utils';

const { ModalRenderer, ProfileCard, styled } = DS;

const ProfilePageCard = styled(ProfileCard)`
  margin-bottom: 0.5rem;
`;

export interface IProfileHeaderProps {
  slotId: string;
  profileId: string;
  profileData: IProfileData;
  loginState: ILoginState;
}

type ProfilePageCardProps = IProfileHeaderProps &
  Omit<
    RootComponentProps,
    | 'domElement'
    | 'events'
    | 'getMenuItems'
    | 'i18n'
    | 'isMobile'
    | 'activeWhen'
    | 'i18nConfig'
    | 'mountParcel'
    | 'name'
    | 'rootNodeId'
    | 'unmountSelf'
  >;

export const ProfilePageHeader: React.FC<ProfilePageCardProps> = props => {
  const { profileData, loginState, profileId, slotId } = props;

  const [modalOpen, setModalOpen] = React.useState<boolean>(false);
  const [selectedStat, setSelectedStat] = React.useState<number>(0);

  const { t } = useTranslation();

  const isFollowingReq = useIsFollowing(loginState.ethAddress, profileData.ethAddress);

  const followedProfiles = isFollowingReq.data;

  const followReq = useFollow();
  const unfollowReq = useUnfollow();

  const userNameTypes = React.useMemo(() => {
    if (profileData) {
      return getUsernameTypes(profileData);
    }
  }, [profileData]);

  const handleFollow = () => {
    if (!loginState.ethAddress) {
      return props.navigateToModal({ name: 'login-modal', profileId });
    }
    if (profileData?.ethAddress) {
      followReq.mutate(profileData.ethAddress);
    }
  };

  const handleUnfollow = () => {
    if (profileData?.ethAddress) {
      unfollowReq.mutate(profileData.ethAddress);
    }
  };

  const showLoginModal = () => {
    props.navigateToModal({ name: 'login' });
  };

  const handleEntryFlag = (entryId: string, itemType: string, user: string) => () => {
    if (!loginState.ethAddress) {
      return props.navigateToModal({
        name: 'login',
        redirectTo: { name: 'report-modal', entryId, itemType, user },
      });
    }
    props.navigateToModal({ name: 'report-modal', entryId, itemType, user });
  };

  const showUpdateProfileModal = () => {
    props.navigateToModal({ name: 'update-profile' });
  };

  const showEnsModal = () => {
    props.navigateToModal({ name: 'update-ens' });
  };

  const showShareModal = () => {
    props.navigateToModal({ name: 'profile-share' });
  };

  const handleStatIconClick = (positionIndex: number) => () => {
    setSelectedStat(positionIndex);
    setModalOpen(true);
  };

  const handleClose = () => {
    setModalOpen(false);
  };

  return (
    <>
      <ModalRenderer slotId={slotId}>
        {modalOpen && (
          <StatModalWrapper
            loginState={loginState}
            selectedStat={selectedStat}
            profileData={profileData}
            singleSpa={props.singleSpa}
            showLoginModal={showLoginModal}
            handleClose={handleClose}
          />
        )}
      </ModalRenderer>
      <ProfilePageCard
        onClickPosts={() => null}
        onClickFollowers={handleStatIconClick(0)}
        onClickFollowing={handleStatIconClick(1)}
        onClickInterests={handleStatIconClick(2)}
        handleFollow={handleFollow}
        handleUnfollow={handleUnfollow}
        handleShareClick={showShareModal}
        isFollowing={followedProfiles.includes(profileData.ethAddress)}
        loggedEthAddress={loginState.ethAddress}
        profileData={profileData}
        followLabel={t('Follow')}
        unfollowLabel={t('Unfollow')}
        descriptionLabel={t('About me')}
        followingLabel={t('Following')}
        followersLabel={t('Followers')}
        postsLabel={t('Posts')}
        interestsLabel={t('Interests')}
        shareProfileLabel={t('Share')}
        editProfileLabel={t('Edit profile')}
        updateProfileLabel={t('Update profile')}
        changeCoverImageLabel={t('Change cover image')}
        cancelLabel={t('Cancel')}
        saveChangesLabel={t('Save changes')}
        canUserEdit={loginState.ethAddress === profileData.ethAddress}
        flaggable={loginState.ethAddress !== profileData.ethAddress}
        flagAsLabel={t('Report')}
        blockLabel={t('Block')}
        userNameType={userNameTypes}
        onEntryFlag={handleEntryFlag(
          profileData.pubKey ? profileData.pubKey : '',
          'account',
          profileData.name,
        )}
        onUpdateClick={showUpdateProfileModal}
        onENSChangeClick={showEnsModal}
        changeENSLabel={
          userNameTypes.available.includes(UsernameTypes.AKASHA_ENS_SUBDOMAIN) ||
          userNameTypes.available.includes(UsernameTypes.ENS_DOMAIN)
            ? t('Manage Ethereum name')
            : t('Add an Ethereum name')
        }
        copyLabel={t('Copy to clipboard')}
        copiedLabel={t('Copied')}
      />
    </>
  );
};

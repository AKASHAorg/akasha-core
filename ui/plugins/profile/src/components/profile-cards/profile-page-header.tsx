import * as React from 'react';
import { useTranslation } from 'react-i18next';
import DS from '@akashaproject/design-system';
import { RootComponentProps } from '@akashaproject/ui-awf-typings';
import {
  useIsFollowing,
  useFollow,
  useUnfollow,
} from '@akashaproject/ui-awf-hooks/lib/use-follow.new';
import { IProfileData, UsernameTypes } from '@akashaproject/ui-awf-typings/lib/profile';
import { getUsernameTypes } from '../../utils/username-utils';

const { ProfileCard, styled } = DS;

const ProfilePageCard = styled(ProfileCard)`
  margin-bottom: 0.5rem;
`;

export interface IProfileHeaderProps {
  profileId: string;
  profileData: IProfileData;
  loggedUserEthAddress: string | null;
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
  const { profileData, loggedUserEthAddress, profileId } = props;

  const { t } = useTranslation();

  const isFollowingReq = useIsFollowing(loggedUserEthAddress, profileData.ethAddress);
  const followedProfiles = isFollowingReq.data;
  const followReq = useFollow();
  const unfollowReq = useUnfollow();

  const userNameTypes = React.useMemo(() => {
    if (profileData) {
      return getUsernameTypes(profileData);
    }
  }, [profileData]);

  const handleFollow = () => {
    if (!loggedUserEthAddress) {
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

  const handleEntryFlag = (entryId: string, contentType: string, user: string) => () => {
    if (!loggedUserEthAddress) {
      return props.navigateToModal({
        name: 'login',
        redirectTo: { name: 'report-modal', entryId, contentType, user },
      });
    }
    props.navigateToModal({ name: 'report-modal', entryId, contentType, user });
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

  return (
    <>
      <ProfilePageCard
        onClickFollowers={() => null}
        onClickFollowing={() => null}
        onClickPosts={() => null}
        onClickInterests={() => null}
        handleFollow={handleFollow}
        handleUnfollow={handleUnfollow}
        handleShareClick={showShareModal}
        isFollowing={followedProfiles.includes(profileData.ethAddress)}
        loggedEthAddress={loggedUserEthAddress}
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
        canUserEdit={loggedUserEthAddress === profileData.ethAddress}
        flaggable={loggedUserEthAddress !== profileData.ethAddress}
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

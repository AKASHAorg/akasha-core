import * as React from 'react';
import { useTranslation } from 'react-i18next';
import DS from '@akashaproject/design-system';
import { RootComponentProps } from '@akashaproject/ui-awf-typings';
import {
  useIsFollowing,
  useFollow,
  useUnfollow,
} from '@akashaproject/ui-awf-hooks/lib/use-follow.new';
import { IProfileData, IProfileProvider } from '@akashaproject/ui-awf-typings/lib/profile';

const { ProfileCard, styled } = DS;

const ProfilePageCard = styled(ProfileCard)`
  margin-bottom: 0.5rem;
`;

export interface IProfileHeaderProps {
  profileId: string;
  profileState: Partial<IProfileData & { isLoading: boolean }>;
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
  const { profileState, loggedUserEthAddress, profileId } = props;

  const { t } = useTranslation();

  const isFollowingReq = useIsFollowing(loggedUserEthAddress, profileState.ethAddress);
  const followedProfiles = isFollowingReq.data;
  const followReq = useFollow();
  const unfollowReq = useUnfollow();

  // React.useEffect(() => {
  //   if (
  //     loggedUserEthAddress &&
  //     profileState.ethAddress &&
  //     loggedUserEthAddress !== profileState.ethAddress
  //   ) {
  //     followActions.isFollowing(loggedUserEthAddress, profileState.ethAddress);
  //   }
  //   // if (loggedUserEthAddress) {
  //   //   networkActions.checkNetwork();
  //   // }
  // }, [loggedUserEthAddress, profileState.ethAddress]);

  const handleFollow = () => {
    if (!loggedUserEthAddress) {
      return props.navigateToModal({ name: 'login-modal', profileId });
    }
    if (profileState?.ethAddress) {
      followReq.mutate(profileState.ethAddress);
    }
  };

  const handleUnfollow = () => {
    if (profileState?.ethAddress) {
      unfollowReq.mutate(profileState.ethAddress);
    }
  };

  const handleEntryFlag = (entryId: string, contentType: string, user: string) => () => {
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
        isFollowing={followedProfiles.includes(profileState.ethAddress)}
        loggedEthAddress={loggedUserEthAddress}
        profileData={{
          ...profileState,
          ethAddress: profileState.ethAddress as string,
          pubKey: profileState.pubKey as string,
          providers: profileState.providers as IProfileProvider[],
          default: profileState.default as IProfileProvider[],
        }}
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
        canUserEdit={loggedUserEthAddress === profileState.ethAddress}
        flaggable={loggedUserEthAddress !== profileState.ethAddress}
        flagAsLabel={t('Report')}
        blockLabel={t('Block')}
        onEntryFlag={handleEntryFlag(
          profileState.pubKey ? profileState.pubKey : '',
          'account',
          profileState.name,
        )}
        onUpdateClick={showUpdateProfileModal}
        onENSChangeClick={showEnsModal}
        changeENSLabel={
          t('Manage Ethereum name')
          // userNameType.available.includes(UsernameTypes.AKASHA_ENS_SUBDOMAIN) ||
          // userNameType.available.includes(UsernameTypes.ENS_DOMAIN)
          //   ? t('Manage Ethereum name')
          //   : t('Add an Ethereum name')
        }
        copyLabel={t('Copy to clipboard')}
        copiedLabel={t('Copied')}
      />
    </>
  );
};

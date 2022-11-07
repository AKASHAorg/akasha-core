import * as React from 'react';
import { useTranslation } from 'react-i18next';
import DS from '@akashaorg/design-system';
import { IProfileData, UsernameTypes, RootComponentProps, EventTypes } from '@akashaorg/typings/ui';
import {
  useIsFollowingMultiple,
  useFollow,
  useUnfollow,
  LoginState,
  useEnsByAddress,
} from '@akashaorg/ui-awf-hooks';

import StatModalWrapper from './stat-modal-wrapper';

import { getUsernameTypes } from '../../utils/username-utils';

const {
  ModalRenderer,
  ProfileCard,
  ExtensionPoint,
  Box,
  ProfileCardEthereumId,
  ProfileCardDescription,
  HorizontalDivider,
  TextLine,
} = DS;

export interface IProfileHeaderProps {
  profileId: string;
  profileData: IProfileData;
  loginState: LoginState;
}

const ProfilePageHeader: React.FC<RootComponentProps & IProfileHeaderProps> = props => {
  const { profileData, loginState, profileId, plugins } = props;

  const [modalOpen, setModalOpen] = React.useState<boolean>(false);
  const [selectedStat, setSelectedStat] = React.useState<number>(0);

  const { t } = useTranslation('app-profile');

  const isFollowingReq = useIsFollowingMultiple(loginState.pubKey, [profileData.pubKey]);
  const followedProfiles = isFollowingReq.data;

  const followReq = useFollow();
  const unfollowReq = useUnfollow();

  const ENSReq = useEnsByAddress(profileData.ethAddress);

  const userNameTypes = React.useMemo(() => {
    if (profileData) {
      /* @Todo: fix my type */
      return getUsernameTypes(profileData) as any;
    }
  }, [profileData]);

  const handleFollow = () => {
    if (!loginState.ethAddress) {
      return props.navigateToModal({ name: 'login', profileId });
    }

    if (profileData?.pubKey) {
      followReq.mutate(profileData.pubKey);
    }
  };

  const handleUnfollow = () => {
    if (profileData?.pubKey) {
      unfollowReq.mutate(profileData.pubKey);
    }
  };

  const showLoginModal = () => {
    props.navigateToModal({ name: 'login' });
  };

  const handleEntryFlag = (entryId: string, itemType: string, user: string) => () => {
    if (!loginState.ethAddress) {
      return props.navigateToModal({
        name: 'login',
        redirectTo: { modal: { name: 'report-modal', entryId, itemType, user } },
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

  const handleExtPointMount = (name: string) => {
    props.uiEvents.next({
      event: EventTypes.ExtensionPointMount,
      data: {
        name,
        pubKey: profileData?.pubKey,
      },
    });
  };

  const handleExtPointUnmount = (name: string) => {
    props.uiEvents.next({
      event: EventTypes.ExtensionPointUnmount,
      data: {
        name,
      },
    });
  };

  return (
    <>
      <ModalRenderer slotId={props.layoutConfig.modalSlotId}>
        {modalOpen && (
          <StatModalWrapper
            loginState={loginState}
            selectedStat={selectedStat}
            profileData={profileData}
            navigateTo={plugins['@akashaorg/app-routing']?.navigateTo}
            showLoginModal={showLoginModal}
            handleClose={handleClose}
          />
        )}
      </ModalRenderer>
      <ProfileCard
        onClickPosts={() => null}
        onClickFollowers={handleStatIconClick(0)}
        onClickFollowing={handleStatIconClick(1)}
        onClickInterests={handleStatIconClick(2)}
        handleFollow={handleFollow}
        handleUnfollow={handleUnfollow}
        handleShareClick={showShareModal}
        isFollowing={followedProfiles?.includes(profileData.pubKey)}
        loggedEthAddress={loginState.ethAddress}
        profileData={profileData}
        followLabel={t('Follow')}
        unfollowLabel={t('Unfollow')}
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
        showMore={true}
        canUserEdit={loginState.ethAddress === profileData.ethAddress}
        flaggable={loginState.ethAddress !== profileData.ethAddress}
        flagAsLabel={t('Report')}
        // blockLabel={t('Block')}
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
        hideENSButton={true}
        copyLabel={t('Copy to clipboard')}
        copiedLabel={t('Copied')}
        modalSlotId={props.layoutConfig.modalSlotId}
        actionButtonExt={
          <ExtensionPoint
            name={`profile-card-action-extension`}
            onMount={handleExtPointMount}
            onUnmount={handleExtPointUnmount}
          />
        }
      >
        <Box pad={{ top: 'medium', bottom: 'xsmall' }}>
          <ProfileCardEthereumId
            profileData={profileData}
            copiedLabel={t('Copied')}
            copyLabel={t('Copy to clipboard')}
          />
          {ENSReq.isFetching && (
            <Box pad="1em">
              <TextLine width="25%" margin={{ bottom: '.5em' }} />
              <TextLine width="48%" />
            </Box>
          )}
          {ENSReq.isFetched && ENSReq.data && (
            <ProfileCardEthereumId
              profileData={profileData}
              copiedLabel={t('Copied')}
              copyLabel={t('Copy to clipboard')}
              ensName={ENSReq.data}
            />
          )}

          {profileData.description && (
            <>
              <Box pad={{ horizontal: 'medium' }}>
                <HorizontalDivider />
              </Box>
              <ProfileCardDescription
                description={profileData.description}
                editable={false}
                handleChangeDescription={() => null}
                descriptionPopoverOpen={false}
                setDescriptionPopoverOpen={() => null}
                // profileProvidersData={profileProvidersData}
                descriptionLabel={t('About me')}
              />
            </>
          )}
        </Box>
      </ProfileCard>
    </>
  );
};

export default ProfilePageHeader;

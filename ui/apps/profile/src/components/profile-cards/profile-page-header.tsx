import * as React from 'react';
import { useTranslation } from 'react-i18next';
import DS from '@akashaorg/design-system';
import {
  IProfileData,
  RootComponentProps,
  EventTypes,
  ProfileProviderProperties,
  ProfileProviders,
} from '@akashaorg/typings/ui';
import {
  useIsFollowingMultiple,
  useFollow,
  useUnfollow,
  LoginState,
  useEnsByAddress,
} from '@akashaorg/ui-awf-hooks';

import StatModalWrapper from './stat-modal-wrapper';
import routes, { UPDATE_PROFILE } from '../../routes';

const {
  ModalRenderer,
  ProfileCard,
  ExtensionPoint,
  Box,
  ProfileCardEthereumId,
  ProfileCardDescription,
  HorizontalDivider,
  TextLine,
  BasicCardBox,
  ProfileStatsCard,
  ProfileLinksCard,
} = DS;

export interface IProfileHeaderProps {
  profileId: string;
  profileData: IProfileData;
  loginState: LoginState;
}

const ProfilePageHeader: React.FC<RootComponentProps & IProfileHeaderProps> = props => {
  const { profileData, loginState, profileId, plugins } = props;

  const routing = plugins['@akashaorg/app-routing']?.routing;

  const [modalOpen, setModalOpen] = React.useState<boolean>(false);
  const [selectedStat, setSelectedStat] = React.useState<number>(0);

  const { t } = useTranslation('app-profile');

  const isFollowingReq = useIsFollowingMultiple(loginState.pubKey, [profileData.pubKey]);
  const followedProfiles = isFollowingReq.data;

  const followReq = useFollow();
  const unfollowReq = useUnfollow();

  const ENSReq = useEnsByAddress(profileData.ethAddress);

  const handleFollow = () => {
    if (!loginState.ethAddress) {
      return props.navigateToModal({ name: 'login', profileId });
    }

    if (profileData?.pubKey) {
      followReq.mutate(profileData.pubKey);
    }
  };

  const socialLinks: { type: string; value: string }[] = React.useMemo(() => {
    if (profileData.default.length > 0) {
      const socialLinksProvider = profileData.default.find(
        p =>
          p.property === ProfileProviderProperties.SOCIAL_LINKS &&
          p.provider === ProfileProviders.EWA_BASIC,
      );
      if (socialLinksProvider) {
        const links = JSON.parse(socialLinksProvider.value);
        if (links.length > 0) {
          return links.map((link: { type: string; value: string }) => {
            if (link.type === 'url') {
              return {
                type: link.type,
                value: decodeURIComponent(link.value),
              };
            }
            return {
              type: link.type,
              value: link.value,
            };
          });
        }
      }
    }
    return [];
  }, [profileData]);

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
    props.plugins['@akashaorg/app-routing']?.routing?.navigateTo({
      appName: '@akashaorg/app-profile',
      getNavigationUrl: () => routes[UPDATE_PROFILE],
    });
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

  const handleClickPosts = () => {
    routing.navigateTo({
      appName: '@akashaorg/app-akasha-integration',
      getNavigationUrl: routes => `${routes.ProfileFeed}/${profileData.pubKey}`,
    });
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
        handleFollow={handleFollow}
        handleUnfollow={handleUnfollow}
        handleShareClick={showShareModal}
        isFollowing={followedProfiles?.includes(profileData.pubKey)}
        profileData={profileData}
        followLabel={t('Follow')}
        followingLabel={t('Following')}
        unfollowLabel={t('Unfollow')}
        shareProfileLabel={t('Share')}
        editProfileLabel={t('Edit profile')}
        showMore={true}
        viewerIsOwner={loginState.ethAddress === profileData.ethAddress}
        flaggable={loginState.ethAddress !== profileData.ethAddress}
        flagAsLabel={t('Report')}
        onEntryFlag={handleEntryFlag(
          profileData.pubKey ? profileData.pubKey : '',
          'account',
          profileData.name,
        )}
        onUpdateClick={showUpdateProfileModal}
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
          {ENSReq.isFetching && !ENSReq.isFetched && (
            <Box pad="1em">
              <TextLine width="25%" margin={{ bottom: '.5em' }} />
              <TextLine width="48%" />
            </Box>
          )}
          {ENSReq.isFetched && ENSReq.data && (
            <>
              <Box pad={{ horizontal: 'medium' }}>
                <HorizontalDivider />
              </Box>
              <ProfileCardEthereumId
                ethereumNameLabel={t('ENS')}
                profileData={profileData}
                copiedLabel={t('Copied')}
                copyLabel={t('Copy to clipboard')}
                ensName={ENSReq.data}
              />
            </>
          )}
        </Box>
      </ProfileCard>
      {profileData.description && (
        <BasicCardBox margin={{ top: 'xsmall' }}>
          <ProfileCardDescription
            description={profileData.description}
            descriptionLabel={t('About me')}
          />
        </BasicCardBox>
      )}
      <ProfileLinksCard
        margin={{ top: 'xsmall' }}
        titleLabel={t('Find me on')}
        copiedLabel={t('Copied')}
        copyLabel={t('Copy to clipboard')}
        links={socialLinks}
      />
      <ProfileStatsCard
        margin={{ top: 'xsmall', bottom: 'large' }}
        statsTitleLabel={t('Stats')}
        profileData={profileData}
        onClickFollowing={handleStatIconClick(1)}
        onClickFollowers={handleStatIconClick(0)}
        onClickInterests={handleStatIconClick(2)}
        onClickPosts={() => null}
        followingLabel={t('Following')}
        followersLabel={t('Followers')}
        postsLabel={t('Posts')}
        interestsLabel={t('Interests')}
      />
    </>
  );
};

export default ProfilePageHeader;

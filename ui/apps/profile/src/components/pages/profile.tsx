import * as React from 'react';
import Snackbar from '@akashaorg/design-system-core/lib/components/Snackbar';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';

import {
  IProfileData,
  RootComponentProps,
  EventTypes,
  ProfileProviderProperties,
  ProfileProviders,
  EntityTypes,
  EngagementType,
} from '@akashaorg/typings/ui';
import {
  useIsFollowingMultiple,
  useFollow,
  useUnfollow,
  LoginState,
  useEnsByAddress,
  useCheckModerator,
} from '@akashaorg/ui-awf-hooks';

// import ModeratorLabel from '../routes/moderator-label';
import routes, { EDIT } from '../../routes';
import {
  ProfileHeader,
  ProfileBio,
  ProfileLinks,
  ProfileStats,
} from '@akashaorg/design-system-components/lib/components/Profile';

export type ProfilePageProps = {
  profileId: string;
  profileData: IProfileData;
  loginState: LoginState;
};

const ProfilePage: React.FC<RootComponentProps & ProfilePageProps> = props => {
  const { profileData, loginState, profileId } = props;

  // undefined for logged user's profile page, use loginState?.pubKey instead
  const { pubKey } = useParams<{
    pubKey: string;
  }>();

  const navigateTo = props.plugins['@akashaorg/app-routing']?.routing?.navigateTo;

  const { t } = useTranslation('app-profile');

  const [showFeedback, setShowFeedback] = React.useState(false);

  const isFollowingReq = useIsFollowingMultiple(loginState.pubKey, [profileData.pubKey]);
  const followedProfiles = isFollowingReq.data;

  const followReq = useFollow();
  const unfollowReq = useUnfollow();

  const ENSReq = useEnsByAddress(profileData.ethAddress);

  const checkModeratorQuery = useCheckModerator(loginState?.pubKey);
  const checkModeratorResp = checkModeratorQuery.data;

  const isModerator = React.useMemo(() => checkModeratorResp === 200, [checkModeratorResp]);

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
      setShowFeedback(true);
      setTimeout(() => {
        setShowFeedback(false);
      }, 5000);
    }
  };

  const showLoginModal = () => {
    props.navigateToModal({ name: 'login' });
  };

  const handleEntryFlag = (itemId: string, itemType: EntityTypes, user: string) => () => {
    if (!loginState.ethAddress) {
      return props.navigateToModal({
        name: 'login',
        redirectTo: { modal: { name: 'report-modal', itemId, itemType, user } },
      });
    }
    props.navigateToModal({ name: 'report-modal', itemId, itemType, user });
  };

  const showUpdateProfileModal = () => {
    navigateTo({
      appName: '@akashaorg/app-profile',
      getNavigationUrl: () => routes['edit'],
    });
  };

  const showShareModal = () => {
    props.navigateToModal({ name: 'profile-share' });
  };

  const onStatClick = (stat: EngagementType) => () => {
    navigateTo({
      appName: '@akashaorg/app-profile',
      getNavigationUrl: routes =>
        `/${pubKey ?? loginState?.pubKey}${routes.engagement}?tab=${stat}`,
    });
  };

  const handleNavigateToProfilePosts = () => {
    navigateTo({
      appName: '@akashaorg/app-akasha-integration',
      getNavigationUrl: routes => `${routes.ProfileFeed}/${pubKey ?? loginState?.pubKey}`,
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
      <Stack direction="column" spacing="gap-y-4">
        {/*@TODO remove the following line when the profile app is done */}
        {/* <Profile
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
            EntityTypes.PROFILE,
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
        </Profile> */}
        <ProfileHeader
          ethAddress={profileData.ethAddress}
          coverImage={profileData.coverImage}
          avatar={profileData.avatar}
          name={profileData.name}
          userName={profileData.userName}
          ensName={
            ENSReq.isFetching && !ENSReq.isFetched
              ? 'loading'
              : ENSReq.isFetched && ENSReq.data
              ? ENSReq.data
              : ''
          }
          isFollowing={followedProfiles?.includes(profileData.pubKey)}
          viewerIsOwner={loginState.ethAddress === profileData.ethAddress}
          flagLabel={t('Report')}
          handleUnfollow={handleUnfollow}
          handleFollow={handleFollow}
          handleFlag={handleEntryFlag(
            profileData.pubKey ? profileData.pubKey : '',
            EntityTypes.PROFILE,
            profileData.name,
          )}
          handleEdit={() => {
            navigateTo({
              appName: '@akashaorg/app-profile',
              getNavigationUrl: () => `${pubKey}/${routes[EDIT]}`,
            });
          }}
        />
        {/*@TODO replace moderator label with new design when its ready */}
        {/* {isModerator && <ModeratorLabel label={t('Moderator')} />} */}
        {profileData.description && (
          <ProfileBio title={t('Bio')} biography={profileData.description} />
        )}
        <ProfileStats
          posts={{
            label: t('Posts'),
            total: profileData.totalPosts,
            onClick: handleNavigateToProfilePosts,
          }}
          interests={{
            label: t('Interests'),
            total: profileData.totalInterests,
          }}
          followers={{
            label: t('Followers'),
            total: profileData.totalFollowers,
            onClick: onStatClick('followers'),
          }}
          following={{
            label: t('Following'),
            total: profileData.totalFollowing,
            onClick: onStatClick('following'),
          }}
        />
        {socialLinks.length > 0 && (
          <ProfileLinks
            title={t('Find me on')}
            links={socialLinks}
            copiedLabel={t('Copied')}
            copyLabel={t('Copy to clipboard')}
          />
        )}
        {showFeedback && loginState.ethAddress === profileData.ethAddress && (
          <Snackbar
            title={t('You unfollowed {{userName}}', { userName: profileData.userName })}
            iconType="CheckCircleIcon"
            handleDismiss={() => {
              setShowFeedback(false);
            }}
            customStyle="mb-4"
          />
        )}
      </Stack>
    </>
  );
};

export default ProfilePage;

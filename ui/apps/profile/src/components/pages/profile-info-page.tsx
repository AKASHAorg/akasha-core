import React from 'react';
import Snackbar from '@akashaorg/design-system-core/lib/components/Snackbar';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import routes, { EDIT } from '../../routes';
import { useTranslation } from 'react-i18next';
import { RootComponentProps, EntityTypes } from '@akashaorg/typings/ui';
import {
  ProfileHeader,
  ProfileBio,
  ProfileLinks,
  ProfileLoading,
} from '@akashaorg/design-system-components/lib/components/Profile';
import ProfileStatsPresentation from '../profile-stats-presentation';
import {
  useGetFollowingListByDidQuery,
  useGetProfileByDidQuery,
  useUpdateFollowMutation,
} from '@akashaorg/ui-awf-hooks/lib/generated/hooks-new';
import { useParams } from 'react-router';
import ErrorLoader from '@akashaorg/design-system-core/lib/components/ErrorLoader';
import { getProfileImageVersionsWithMediaUrl, useGetLogin } from '@akashaorg/ui-awf-hooks';

const ProfileInfoPage: React.FC<RootComponentProps> = props => {
  const { plugins } = props;

  const { t } = useTranslation('app-profile');

  const [showFeedback, setShowFeedback] = React.useState(false);

  const navigateTo = plugins['@akashaorg/app-routing']?.routing?.navigateTo;

  const { profileId } = useParams<{ profileId: string }>();

  const loginQuery = useGetLogin();

  const profileDataReq = useGetProfileByDidQuery(
    {
      id: profileId,
    },
    {
      select: response => response.node,
      enabled: !!profileId,
    },
  );
  const followingListReq = useGetFollowingListByDidQuery(
    { id: profileId },
    { select: resp => resp.node },
  );
  const updateFollowReq = useUpdateFollowMutation();
  const status = profileDataReq.status;
  const { isViewer, profile: profileData } =
    profileDataReq.data && 'isViewer' in profileDataReq.data
      ? profileDataReq.data
      : { isViewer: null, profile: null };

  if (status === 'loading') return <ProfileLoading />;

  if (loginQuery.data?.id && !profileData) {
    return navigateTo({
      appName: '@akashaorg/app-profile',
      getNavigationUrl: () => `/${profileId}${routes[EDIT]}`,
    });
  }

  const hasError = status === 'error' || (status === 'success' && !profileData);

  if (hasError)
    return (
      <ErrorLoader
        type="script-error"
        title={t('There was an error loading this profile')}
        details={t('We cannot show this profile right now')}
      />
    );

  const isFollowing =
    followingListReq.data && 'isViewer' in followingListReq.data
      ? followingListReq.data?.followList?.edges?.length > 0
      : false;

  const handleFollow = () => {
    if (profileId) {
      updateFollowReq.mutate({ i: { id: profileData.did.id, content: { isFollowing: true } } });
    }
  };

  const handleUnfollow = () => {
    updateFollowReq.mutate({ i: { id: profileData.did.id, content: { isFollowing: false } } });
    setShowFeedback(true);
    setTimeout(() => {
      setShowFeedback(false);
    }, 5000);
  };

  const handleEntryFlag = (itemId: string, itemType: EntityTypes, user: string) => () => {
    if (!profileData?.did?.id) {
      return props.navigateToModal({
        name: 'login',
        redirectTo: { modal: { name: 'report-modal', itemId, itemType, user } },
      });
    }
    props.navigateToModal({ name: 'report-modal', itemId, itemType, user });
  };

  const background = getProfileImageVersionsWithMediaUrl(profileData?.background);
  const avatar = getProfileImageVersionsWithMediaUrl(profileData?.avatar);

  return (
    <>
      <Stack direction="column" spacing="gap-y-4" fullWidth>
        <ProfileHeader
          did={profileData.did}
          background={background}
          avatar={avatar}
          name={profileData.name}
          ensName={null /*@TODO: integrate ENS when the API is ready */}
          isFollowing={isFollowing}
          viewerIsOwner={isViewer}
          flagLabel={t('Report')}
          copyLabel={t('Copy to clipboard')}
          copiedLabel={t('Copied')}
          handleUnfollow={handleUnfollow}
          handleFollow={handleFollow}
          handleFlag={handleEntryFlag(
            profileData.did.id ? profileData.did.id : '',
            EntityTypes.PROFILE,
            profileData.name,
          )}
          handleEdit={() => {
            navigateTo({
              appName: '@akashaorg/app-profile',
              getNavigationUrl: () => `/${profileId}${routes[EDIT]}`,
            });
          }}
        />
        {profileData.description && (
          <ProfileBio title={t('Bio')} biography={profileData.description} />
        )}
        <ProfileStatsPresentation profileId={profileId} navigateTo={navigateTo} />
        {profileData.links?.length > 0 && (
          <ProfileLinks
            title={t('Find me on')}
            links={profileData.links}
            copiedLabel={t('Copied')}
            copyLabel={t('Copy to clipboard')}
          />
        )}
        {showFeedback && isViewer && (
          <Snackbar
            title={t('You unfollowed {{name}}', { userName: profileData.name })}
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

export default ProfileInfoPage;

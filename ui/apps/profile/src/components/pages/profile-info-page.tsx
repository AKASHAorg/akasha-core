import React from 'react';
import Snackbar from '@akashaorg/design-system-core/lib/components/Snackbar';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import FollowProfile from '../follow-profile';
import ErrorLoader from '@akashaorg/design-system-core/lib/components/ErrorLoader';
import ProfileStatsPresentation from '../profile-stats-presentation';
import routes, { EDIT } from '../../routes';
import { useTranslation } from 'react-i18next';
import { RootComponentProps, EntityTypes } from '@akashaorg/typings/ui';
import {
  ProfileHeader,
  ProfileBio,
  ProfileLinks,
  ProfileLoading,
} from '@akashaorg/design-system-components/lib/components/Profile';
import { useGetProfileByDidQuery } from '@akashaorg/ui-awf-hooks/lib/generated/hooks-new';
import { useParams } from 'react-router';
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

  const status = profileDataReq.status;
  const { isViewer, profile: profileData } =
    profileDataReq.data && 'isViewer' in profileDataReq.data
      ? profileDataReq.data
      : { isViewer: null, profile: null };

  const isLoggedIn = !!loginQuery.data?.id;

  if (status === 'loading') return <ProfileLoading />;

  if (isLoggedIn && !profileData) {
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

  const checkAuth = (cb: () => void) => () => {
    if (!isLoggedIn) {
      navigateTo({
        appName: '@akashaorg/app-auth-ewa',
        getNavigationUrl: navRoutes => navRoutes.CONNECT,
      });
      return;
    }
    cb();
  };

  const handleEntryFlag = (itemId: string, itemType: EntityTypes, user: string) => () => {
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
          viewerIsOwner={isViewer}
          flagLabel={t('Report')}
          copyLabel={t('Copy to clipboard')}
          copiedLabel={t('Copied')}
          followElement={<FollowProfile profileId={profileId} navigateTo={navigateTo} />}
          handleFlag={checkAuth(
            handleEntryFlag(
              profileData.did.id ? profileData.did.id : '',
              EntityTypes.PROFILE,
              profileData.name,
            ),
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
        {showFeedback && (
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

import React from 'react';
import { useParams } from 'react-router';
import { useTranslation } from 'react-i18next';

import { RootComponentProps, EntityTypes } from '@akashaorg/typings/ui';
import { getProfileImageVersionsWithMediaUrl, useGetLogin } from '@akashaorg/ui-awf-hooks';
import { useGetProfileByDidQuery } from '@akashaorg/ui-awf-hooks/lib/generated/hooks-new';

import ErrorLoader from '@akashaorg/design-system-core/lib/components/ErrorLoader';
import { MenuProps } from '@akashaorg/design-system-core/lib/components/Menu';
import Snackbar from '@akashaorg/design-system-core/lib/components/Snackbar';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import {
  ProfileHeader,
  ProfileBio,
  ProfileLinks,
  ProfileLoading,
} from '@akashaorg/design-system-components/lib/components/Profile';

import FollowProfile from '../follow-profile';
import ProfileStatsPresentation from '../profile-stats-presentation';
import routes, { EDIT } from '../../routes';

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

  const handleCopy = () => {
    /** handle copy */
    const profileUrl = `${location.origin}/@akashaorg/app-profile/${profileId}`;

    navigator.clipboard.writeText(profileUrl).then(() => {
      setShowFeedback(true);
    });
  };

  const handleFlag = (itemId: string, itemType: EntityTypes, user: string) => () => {
    props.navigateToModal({ name: 'report-modal', itemId, itemType, user });
  };

  const handleEdit = () => {
    navigateTo({
      appName: '@akashaorg/app-profile',
      getNavigationUrl: () => `/${profileId}${routes[EDIT]}`,
    });
  };

  const background = getProfileImageVersionsWithMediaUrl(profileData?.background);
  const avatar = getProfileImageVersionsWithMediaUrl(profileData?.avatar);

  const menuItems: MenuProps['items'] = [
    {
      label: t('Copy link'),
      icon: 'LinkIcon',
      onClick: handleCopy,
    },
    ...(!isViewer
      ? ([
          {
            label: t('Report'),
            icon: 'FlagIcon',
            onClick: checkAuth(
              handleFlag(
                profileData.did.id ? profileData.did.id : '',
                EntityTypes.PROFILE,
                profileData.name,
              ),
            ),
            color: { light: 'errorLight', dark: 'errorDark' },
          },
        ] as MenuProps['items'])
      : []),
  ];

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
          menuItems={menuItems}
          copyLabel={t('Copy to clipboard')}
          copiedLabel={t('Copied')}
          followElement={
            <FollowProfile profileId={profileId} isIconButton={true} navigateTo={navigateTo} />
          }
          handleEdit={handleEdit}
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
            title={`${t('Profile link copied')}!`}
            type="success"
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

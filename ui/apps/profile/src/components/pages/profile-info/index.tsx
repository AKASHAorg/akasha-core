import React from 'react';
import DefaultEmptyCard from '@akashaorg/design-system-components/lib/components/DefaultEmptyCard';
import ErrorLoader from '@akashaorg/design-system-core/lib/components/ErrorLoader';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import ProfileStatsView from '../../profile-stats-view';
import ProfileNotFound from '@akashaorg/design-system-components/lib/components/ProfileNotFound';
import routes, { EDIT } from '../../../routes';
import {
  ProfileBio,
  ProfileLinks,
  ProfileLoading,
} from '@akashaorg/design-system-components/lib/components/Profile';
import { useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { ModalNavigationOptions } from '@akashaorg/typings/lib/ui';
import {
  hasOwn,
  useLoggedIn,
  useProfileStats,
  useRootComponentProps,
  useValidDid,
} from '@akashaorg/ui-awf-hooks';
import { useGetProfileByDidQuery } from '@akashaorg/ui-awf-hooks/lib/generated';

export type ProfilePageProps = {
  showLoginModal: (redirectTo?: { modal: ModalNavigationOptions }) => void;
};

const ProfileInfoPage: React.FC<ProfilePageProps> = props => {
  const { showLoginModal } = props;

  const { t } = useTranslation('app-profile');
  const { getRoutingPlugin } = useRootComponentProps();

  const { profileId } = useParams<{ profileId: string }>();
  const { isLoggedIn } = useLoggedIn();

  const navigateTo = getRoutingPlugin().navigateTo;

  const profileDataReq = useGetProfileByDidQuery(
    {
      id: profileId,
    },
    {
      select: response => response.node,
      enabled: !!profileId,
    },
  );
  const { validDid, isLoading } = useValidDid(profileId, !!profileDataReq.data);

  const profileStatsQuery = useProfileStats(profileId);

  const {
    data: { totalBeams, totalFollowers, totalFollowing, totalTopics },
  } = profileStatsQuery.data;

  const { akashaProfile: profileData } =
    profileDataReq.data && hasOwn(profileDataReq.data, 'isViewer')
      ? profileDataReq.data
      : { akashaProfile: null };
  const status = profileDataReq.status;
  const hasProfile = status === 'success' && profileData;

  const goToHomepage = () => {
    navigateTo({
      appName: '@akashaorg/app-akasha-integration',
      getNavigationUrl: navRoutes => navRoutes.defaultRoute,
    });
  };

  if (status === 'loading' || profileStatsQuery.isLoading || isLoading) return <ProfileLoading />;

  if (status === 'error')
    return (
      <ErrorLoader
        type="script-error"
        title={t('There was an error loading this profile')}
        details={t('We cannot show this profile right now')}
      />
    );

  if (!hasProfile && !validDid)
    return (
      <ProfileNotFound
        titleLabel={t('This profile doesn’t exist')}
        buttonLabel={t('Go back home')}
        onClickGoToHomepage={goToHomepage}
      />
    );

  const goEditProfile = () => {
    return navigateTo({
      appName: '@akashaorg/app-profile',
      getNavigationUrl: () => `/${profileId}${routes[EDIT]}`,
    });
  };

  return (
    <Stack direction="column" spacing="gap-y-4" fullWidth>
      {profileData?.description && (
        <ProfileBio title={t('Bio')} biography={profileData.description} />
      )}
      {!isLoggedIn && !hasProfile && (
        <DefaultEmptyCard
          infoText={t("It seems this user hasn't filled in their information just yet. 🤔")}
          customCardSize={{ width: '140px', height: '85px' }}
        />
      )}

      {isLoggedIn && !profileData && (
        <DefaultEmptyCard
          infoText={t('Uh-uh! it looks like you haven’t filled your information!')}
          buttonLabel={t('Fill my info')}
          buttonClickHandler={goEditProfile}
        />
      )}
      <ProfileStatsView
        profileId={profileId}
        totalBeams={totalBeams}
        totalTopics={totalTopics}
        totalFollowers={totalFollowers}
        totalFollowing={totalFollowing}
        navigateTo={navigateTo}
        showLoginModal={() => showLoginModal({ modal: { name: location.pathname } })}
      />
      {profileData?.links?.length > 0 && (
        <ProfileLinks
          title={t('Find me on')}
          links={profileData?.links}
          copiedLabel={t('Copied')}
          copyLabel={t('Copy to clipboard')}
        />
      )}
    </Stack>
  );
};

export default ProfileInfoPage;

import React from 'react';
import DefaultEmptyCard from '@akashaorg/design-system-components/lib/components/DefaultEmptyCard';
import ErrorLoader from '@akashaorg/design-system-core/lib/components/ErrorLoader';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import ProfileStatsView from '../../profile-stats-view';
import ProfileNotFound from '@akashaorg/design-system-components/lib/components/ProfileNotFound';
import NSFW from './nsfw';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import routes, { EDIT } from '../../../routes';
import {
  ProfileBio,
  ProfileLinks,
  ProfileLoading,
  ProfileStatLoading,
} from '@akashaorg/design-system-components/lib/components/Profile';
import { useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { EventTypes, ModalNavigationOptions } from '@akashaorg/typings/lib/ui';
import {
  hasOwn,
  useGetLogin,
  useProfileStats,
  useRootComponentProps,
  useValidDid,
} from '@akashaorg/ui-awf-hooks';
import { useGetProfileByDidQuery } from '@akashaorg/ui-awf-hooks/lib/generated/apollo';

export type ProfilePageProps = {
  showNSFW: boolean;
  showLoginModal: (redirectTo?: { modal: ModalNavigationOptions }) => void;
  setShowNSFW: React.Dispatch<React.SetStateAction<boolean>>;
};

const ProfileInfoPage: React.FC<ProfilePageProps> = props => {
  const { showNSFW, setShowNSFW, showLoginModal } = props;
  const { t } = useTranslation('app-profile');
  const { getRoutingPlugin, uiEvents } = useRootComponentProps();
  const { profileId } = useParams<{ profileId: string }>();
  const { data: loginData } = useGetLogin();
  const { data, loading, error } = useGetProfileByDidQuery({
    variables: {
      id: profileId,
    },
    skip: !profileId,
  });
  const { validDid, isLoading: validDidCheckLoading } = useValidDid(profileId, !!data?.node);
  const { data: statData, loading: statsLoading } = useProfileStats(profileId);
  const isLoggedIn = !!loginData?.id;
  const authenticatedDID = loginData?.id;
  const navigateTo = getRoutingPlugin().navigateTo;
  const { akashaProfile: profileData } =
    data?.node && hasOwn(data.node, 'akashaProfile') ? data.node : { akashaProfile: null };
  const hasProfile = data && profileData;

  const goToHomepage = () => {
    navigateTo({
      appName: '@akashaorg/app-akasha-integration',
      getNavigationUrl: navRoutes => navRoutes.defaultRoute,
    });
  };

  if (loading || validDidCheckLoading) return <ProfileLoading />;

  if (error)
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

  if (profileData?.nsfw && !showNSFW && authenticatedDID !== profileData.did.id)
    return (
      <Card>
        <NSFW
          sensitiveContentLabel={t('NSFW Profile')}
          descriptionFirstLine={t('This profile is marked as NSFW.')}
          descriptionSecondLine={t(
            'It means that the content of this profile has inappropriate content for some users.',
          )}
          clickToViewLabel={t('View Profile')}
          cancelLabel={t('Cancel')}
          onCancel={() => {
            uiEvents.next({
              event: EventTypes.GoBackToPreviousRoute,
            });
          }}
          onClickToView={() => {
            setShowNSFW(true);
          }}
        />
      </Card>
    );

  const goToEditProfile = () => {
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
          buttonClickHandler={goToEditProfile}
        />
      )}
      {statsLoading && <ProfileStatLoading />}
      {statData && (
        <ProfileStatsView
          profileId={profileId}
          totalBeams={statData.totalBeams}
          totalTopics={statData.totalTopics}
          totalFollowers={statData.totalFollowers}
          totalFollowing={statData.totalFollowing}
          navigateTo={navigateTo}
          showLoginModal={() => showLoginModal({ modal: { name: location.pathname } })}
        />
      )}
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

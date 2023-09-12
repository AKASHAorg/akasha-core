import React from 'react';
import { ProfileStats } from '@akashaorg/design-system-components/lib/components/Profile';
import { useGetProfileStatsByDidQuery } from '@akashaorg/ui-awf-hooks/lib/generated/hooks-new';
import { useTranslation } from 'react-i18next';
import { NavigateToParams, ModalNavigationOptions, AkashaProfile } from '@akashaorg/typings/ui';
import { useGetLogin } from '@akashaorg/ui-awf-hooks';

type ProfileStatsViewProps = {
  profileId: string;
  navigateTo: (args: NavigateToParams) => void;
  showLoginModal: (redirectTo?: { modal: ModalNavigationOptions }) => void;
};

const ProfileStatsView: React.FC<ProfileStatsViewProps> = ({
  profileId,
  navigateTo,
  showLoginModal,
}) => {
  const { t } = useTranslation('app-profile');

  const loginQuery = useGetLogin();
  const isLoggedIn = React.useMemo(() => {
    return !!loginQuery.data?.id;
  }, [loginQuery.data]);

  const statsQuery = useGetProfileStatsByDidQuery(
    { id: profileId },
    { select: response => response.node },
  ) as { data: { akashaProfile: AkashaProfile } };

  const stats = {
    beamsTotal: 10,
    interestsTotal: 10,
    followersTotal: statsQuery.data?.akashaProfile?.followersCount,
    followingTotal: 10,
  };

  const handleNavigateToProfilePosts = () => {
    if (!isLoggedIn) {
      return showLoginModal();
    }
    navigateTo({
      appName: '@akashaorg/app-akasha-integration',
      getNavigationUrl: routes => `${routes.ProfileFeed}/${profileId}`,
    });
  };

  const onStatClick = (stat: 'followers' | 'following' | 'interests') => () => {
    if (!isLoggedIn) {
      return showLoginModal();
    }
    navigateTo({
      appName: '@akashaorg/app-profile',
      getNavigationUrl: () => `/${profileId}/${stat}`,
    });
  };

  return (
    <ProfileStats
      posts={{
        label: t('Beams'),
        total: stats.beamsTotal,
        onClick: handleNavigateToProfilePosts,
      }}
      interests={{
        label: t('Interests'),
        total: stats.interestsTotal,
        onClick: onStatClick('interests'),
      }}
      followers={{
        label: t('Followers'),
        total: stats.followersTotal,
        onClick: onStatClick('followers'),
      }}
      following={{
        label: t('Following'),
        total: stats.followingTotal,
        onClick: onStatClick('following'),
      }}
    />
  );
};

export default ProfileStatsView;

import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { NavigateToParams, ModalNavigationOptions } from '@akashaorg/typings/lib/ui';
import { useGetLogin, useProfileStats } from '@akashaorg/ui-awf-hooks';

import { ProfileStats } from '@akashaorg/design-system-components/lib/components/Profile';

export type ProfileStatsViewProps = {
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
  const isLoggedIn = useMemo(() => {
    return !!loginQuery.data?.id;
  }, [loginQuery.data]);

  const profileStatsQuery = useProfileStats(profileId);

  const {
    data: { totalBeams, totalFollowers, totalFollowing, totalTopics },
  } = profileStatsQuery.data;

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
        total: totalBeams,
        onClick: handleNavigateToProfilePosts,
      }}
      interests={{
        label: t('Interests'),
        total: totalTopics,
        onClick: onStatClick('interests'),
      }}
      followers={{
        label: t('Followers'),
        total: totalFollowers,
        onClick: onStatClick('followers'),
      }}
      following={{
        label: t('Following'),
        total: totalFollowing,
        onClick: onStatClick('following'),
      }}
    />
  );
};

export default ProfileStatsView;

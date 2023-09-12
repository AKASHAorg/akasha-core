import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import getSDK from '@akashaorg/awf-sdk';
import { useGetLogin, useRootComponentProps } from '@akashaorg/ui-awf-hooks';
import { NavigateToParams, ModalNavigationOptions } from '@akashaorg/typings/ui';

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
  const [stats, setStats] = useState({
    totalFollowing: 0,
    totalFollowers: 0,
    totalBeams: 0,
    totalTopics: 0,
  });

  const { t } = useTranslation('app-profile');
  const { logger } = useRootComponentProps();

  const loginQuery = useGetLogin();
  const isLoggedIn = useMemo(() => {
    return !!loginQuery.data?.id;
  }, [loginQuery.data]);

  const sdk = getSDK();

  useEffect(() => {
    const getStats = () => {
      sdk.api.profile
        .getProfileStats(profileId)
        .then(({ data }) => setStats(data))
        .catch(error => logger.error(`Error getting profile stats ${error}`));
    };

    getStats();
  }, [profileId, sdk.api.profile, logger]);

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
        total: stats.totalBeams,
        onClick: handleNavigateToProfilePosts,
      }}
      interests={{
        label: t('Interests'),
        total: stats.totalTopics,
        onClick: onStatClick('interests'),
      }}
      followers={{
        label: t('Followers'),
        total: stats.totalFollowers,
        onClick: onStatClick('followers'),
      }}
      following={{
        label: t('Following'),
        total: stats.totalFollowing,
        onClick: onStatClick('following'),
      }}
    />
  );
};

export default ProfileStatsView;

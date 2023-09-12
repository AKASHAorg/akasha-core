import React from 'react';
import { ProfileStats } from '@akashaorg/design-system-components/lib/components/Profile';
import {
  useGetBeamsByAuthorDidQuery,
  useGetFollowersListByDidQuery,
  useGetFollowingListByDidQuery,
  useGetInterestsByDidQuery,
} from '@akashaorg/ui-awf-hooks/lib/generated/hooks-new';
import { useTranslation } from 'react-i18next';
import { NavigateToParams, ModalNavigationOptions } from '@akashaorg/typings/lib/ui';
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

  /*@TODO: replace the following hook calls when stats are supported via indexing */
  const beams = useGetBeamsByAuthorDidQuery(
    { id: profileId },
    { select: response => response.node },
  );

  const interests = useGetInterestsByDidQuery(
    { id: profileId },
    { select: response => response.node },
  );

  const followers = useGetFollowersListByDidQuery(
    { id: profileId, last: 100 },
    { select: response => response.node },
  );

  const following = useGetFollowingListByDidQuery(
    { id: profileId, last: 100 },
    { select: response => response.node },
  );

  const beamsTotal =
    beams.data && 'akashaBeamList' in beams.data
      ? beams.data?.akashaBeamList?.edges?.length || 0
      : 0;

  const interestsTotal =
    interests.data && 'akashaProfileInterests' in interests.data
      ? interests.data?.akashaProfileInterests?.topics?.length || 0
      : 0;

  const followersTotal =
    followers.data && 'akashaProfile' in followers.data
      ? followers.data?.akashaProfile?.followers?.edges?.length || 0
      : 0;

  const followingTotal =
    following.data && 'akashaFollowList' in following.data
      ? following.data?.akashaFollowList?.edges?.length || 0
      : 0;

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
        total: beamsTotal,
        onClick: handleNavigateToProfilePosts,
      }}
      interests={{
        label: t('Interests'),
        total: interestsTotal,
        onClick: onStatClick('interests'),
      }}
      followers={{
        label: t('Followers'),
        total: followersTotal,
        onClick: onStatClick('followers'),
      }}
      following={{
        label: t('Following'),
        total: followingTotal,
        onClick: onStatClick('following'),
      }}
    />
  );
};

export default ProfileStatsView;

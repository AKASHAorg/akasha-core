import React from 'react';
import { ProfileStats } from '@akashaorg/design-system-components/lib/components/Profile';
import {
  useGetBeamsByAuthorDidQuery,
  useGetFollowersListByDidQuery,
  useGetFollowingListByDidQuery,
  useGetInterestsByDidQuery,
} from '@akashaorg/ui-awf-hooks/lib/generated/hooks-new';
import { useTranslation } from 'react-i18next';
import { EngagementType, NavigateToParams, ModalNavigationOptions } from '@akashaorg/typings/ui';
import { useGetLogin } from '@akashaorg/ui-awf-hooks';

type ProfileStatsPresentationProps = {
  profileId: string;
  navigateTo: (args: NavigateToParams) => void;
  showLoginModal: (redirectTo?: { modal: ModalNavigationOptions }) => void;
};

const ProfileStatsPresentation: React.FC<ProfileStatsPresentationProps> = ({
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
    beams.data && 'beamList' in beams.data ? beams.data?.beamList?.edges?.length || 0 : 0;

  const interestsTotal =
    interests.data && 'interests' in interests.data
      ? interests.data?.interests?.topics?.length || 0
      : 0;

  const followersTotal =
    followers.data && 'profile' in followers.data
      ? followers.data?.profile?.followers?.edges?.length || 0
      : 0;

  const followingTotal =
    following.data && 'followList' in following.data
      ? following.data?.followList?.edges?.length || 0
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

  const onStatClick = (stat: EngagementType) => () => {
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

export default ProfileStatsPresentation;

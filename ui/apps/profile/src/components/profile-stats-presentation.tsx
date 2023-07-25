import React from 'react';
import { ProfileStats } from '@akashaorg/design-system-components/lib/components/Profile';
import {
  useGetBeamsByAuthorDidQuery,
  useGetFollowersListByDidQuery,
  useGetFollowingListByDidQuery,
  useGetInterestsByDidQuery,
} from '@akashaorg/ui-awf-hooks/lib/generated/hooks-new';
import { useTranslation } from 'react-i18next';
import { EngagementType, NavigateToParams } from '@akashaorg/typings/ui';

type ProfileStatsPresentationProps = {
  profileId: string;
  navigateTo: (args: NavigateToParams) => void;
};

const ProfileStatsPresentation: React.FC<ProfileStatsPresentationProps> = ({
  profileId,
  navigateTo,
}) => {
  const { t } = useTranslation('app-profile');

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
    navigateTo({
      appName: '@akashaorg/app-akasha-integration',
      getNavigationUrl: routes => `${routes.ProfileFeed}/${profileId}`,
    });
  };

  const onStatClick = (stat: EngagementType) => () => {
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

import React from 'react';
import ProfileEngagements from '@akashaorg/design-system-components/lib/components/ProfileEngagements';
import { useTranslation } from 'react-i18next';
import {
  Profile,
  NavigateToParams,
  RootComponentProps,
  EngagementType,
} from '@akashaorg/typings/ui';
import {
  useFollowers,
  useFollowing,
  useFollow,
  useIsFollowingMultiple,
  useUnfollow,
} from '@akashaorg/ui-awf-hooks';
import { useSearchParams } from 'react-router-dom';

type ProfileEngagementsPageProps = {
  loggedProfileData: Profile;
  selectedStat: EngagementType;
  profileData: Profile;
  navigateTo?: (args: NavigateToParams) => void;
};

const ProfileEngagementsPage: React.FC<
  RootComponentProps & ProfileEngagementsPageProps
> = props => {
  const { loggedProfileData, selectedStat, profileData, navigateTo } = props;

  const { t } = useTranslation('app-profile');
  const [, setSearchParams] = useSearchParams();
  // get followers for this profile
  const followersReq = useFollowers(profileData.did.id, 500);
  const followers = React.useMemo(
    () => followersReq.data?.pages?.reduce((acc, curr) => [...acc, ...curr.results], []),
    [followersReq.data?.pages],
  );

  // @TODO fix Hooks
  // get accounts this profile is following
  const followingReq = useFollowing(profileData.did.id, 500);
  const following = React.useMemo(
    () => followingReq.data?.pages?.reduce((acc, curr) => [...acc, ...curr.results], []),
    [followingReq.data?.pages],
  );
  const profilePubKeys: string[] = React.useMemo(() => {
    let profiles: Profile[] = [];
    // wait for followers and following queries to finish
    if (Array.isArray(followers)) {
      profiles = [...profiles, ...followers];
    }
    if (Array.isArray(following)) {
      profiles = [...profiles, ...following];
    }
    return profiles.map((profile: Profile) => profile.did.id);
  }, [followers, following]);
  // get followed profiles for logged user
  const isFollowingMultipleReq = useIsFollowingMultiple(loggedProfileData?.did?.id, profilePubKeys);
  const followedProfiles = isFollowingMultipleReq.data;
  // hooks to follow/unfollow profiles
  const followProfileReq = useFollow();
  const unfollowProfileReq = useUnfollow();
  const loadMoreFollowers = React.useCallback(() => {
    if (!followersReq.isFetching && followersReq.hasNextPage) {
      followersReq.fetchNextPage();
    }
  }, [followersReq]);
  const loadMoreFollowing = React.useCallback(() => {
    if (!followingReq.isFetching && followingReq.hasNextPage) {
      followingReq.fetchNextPage();
    }
  }, [followingReq]);
  const onProfileClick = (pubKey: string) => {
    navigateTo?.({
      appName: '@akashaorg/app-profile',
      getNavigationUrl: navRoutes => `${navRoutes.rootRoute}/${pubKey}`,
    });
  };
  const showLoginModal = () => {
    props.navigateToModal({ name: 'login' });
  };
  const onFollow = (pubKey: string) => {
    if (!loggedProfileData?.did?.id) {
      showLoginModal();
      return;
    }
    followProfileReq.mutate(pubKey);
  };
  const onUnfollow = (pubKey: string) => {
    if (!loggedProfileData?.did?.id) {
      showLoginModal();
      return;
    }
    unfollowProfileReq.mutate(pubKey);
  };
  const onError = () => {
    navigateTo?.({
      appName: '@akashaorg/app-profile',
      getNavigationUrl: navRoutes => `${navRoutes.rootRoute}`,
    });
  };

  return (
    <ProfileEngagements
      selectedStat={selectedStat}
      loggedProfileId={loggedProfileData?.did?.id}
      followedProfiles={followedProfiles}
      followers={{
        label: t('Followers'),
        status: followersReq.status,
        data: followers,
        hasNextPage: followersReq.hasNextPage,
        onLoadMore: loadMoreFollowers,
      }}
      following={{
        label: t('Following'),
        status: followingReq.status,
        data: following,
        hasNextPage: followingReq.hasNextPage,
        onLoadMore: loadMoreFollowing,
      }}
      followLabel={t('Follow')}
      unFollowLabel={t('Unfollow')}
      followingLabel={t('Following')}
      loadingMoreLabel={`${t('Loading more')} ...`}
      profileAnchorLink={'/@akashaorg/app-profile'}
      ownerUserName={profileData.name}
      viewerIsOwner={loggedProfileData.did.isViewer}
      onError={onError}
      onProfileClick={onProfileClick}
      onFollow={onFollow}
      onUnfollow={onUnfollow}
      onChange={selectedStat => setSearchParams({ tab: selectedStat }, { replace: true })}
    />
  );
};

export default ProfileEngagementsPage;

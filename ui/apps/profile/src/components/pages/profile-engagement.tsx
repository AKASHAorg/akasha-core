import React from 'react';
import ProfileEngagements from '@akashaorg/design-system-components/lib/components/ProfileEngagements';
import { useTranslation } from 'react-i18next';
import {
  IProfileData,
  NavigateToParams,
  RootComponentProps,
  EngagementType,
} from '@akashaorg/typings/ui';
import {
  useFollowers,
  useFollowing,
  LoginState,
  useFollow,
  useIsFollowingMultiple,
  useUnfollow,
} from '@akashaorg/ui-awf-hooks';
import { useSearchParams } from 'react-router-dom';

type ProfileEngagementsPageProps = {
  loginState: LoginState;
  selectedStat: EngagementType;
  profileData: IProfileData;
  navigateTo?: (args: NavigateToParams) => void;
};

const ProfileEngagementsPage: React.FC<
  RootComponentProps & ProfileEngagementsPageProps
> = props => {
  const { loginState, selectedStat, profileData, navigateTo } = props;

  const { t } = useTranslation('app-profile');
  const [, setSearchParams] = useSearchParams();
  // get followers for this profile
  const followersReq = useFollowers(profileData.pubKey, 500);
  const followers = React.useMemo(
    () => followersReq.data?.pages?.reduce((acc, curr) => [...acc, ...curr.results], []),
    [followersReq.data?.pages],
  );
  // get accounts this profile is following
  const followingReq = useFollowing(profileData.pubKey, 500);
  const following = React.useMemo(
    () => followingReq.data?.pages?.reduce((acc, curr) => [...acc, ...curr.results], []),
    [followingReq.data?.pages],
  );
  const profilePubKeys: string[] = React.useMemo(() => {
    let profiles: IProfileData[] = [];
    // wait for followers and following queries to finish
    if (Array.isArray(followers)) {
      profiles = [...profiles, ...followers];
    }
    if (Array.isArray(following)) {
      profiles = [...profiles, ...following];
    }
    return profiles.map((profile: { pubKey: string }) => profile.pubKey);
  }, [followers, following]);
  // get followed profiles for logged user
  const isFollowingMultipleReq = useIsFollowingMultiple(loginState.pubKey, profilePubKeys);
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
    if (!loginState.ethAddress) {
      showLoginModal();
      return;
    }
    followProfileReq.mutate(pubKey);
  };
  const onUnfollow = (pubKey: string) => {
    if (!loginState.ethAddress) {
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
      pubKeyOfLoggedUser={loginState.pubKey}
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
      ownerUserName={profileData.userName}
      viewerIsOwner={loginState.ethAddress === profileData.ethAddress}
      onError={onError}
      onProfileClick={onProfileClick}
      onFollow={onFollow}
      onUnfollow={onUnfollow}
      onChange={selectedStat => setSearchParams({ tab: selectedStat }, { replace: true })}
    />
  );
};

export default ProfileEngagementsPage;

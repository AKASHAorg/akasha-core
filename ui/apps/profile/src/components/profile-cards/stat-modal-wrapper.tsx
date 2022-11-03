import React from 'react';
import { useTranslation } from 'react-i18next';

import DS from '@akashaorg/design-system';
import { IProfileData, NavigateToParams } from '@akashaorg/typings/ui';
import {
  useFollowers,
  useFollowing,
  useInterests,
  useTagSubscriptions,
  useToggleTagSubscription,
  LoginState,
  useFollow,
  useIsFollowingMultiple,
  useUnfollow,
} from '@akashaorg/ui-awf-hooks';

interface IStatModalWrapper {
  loginState: LoginState;
  selectedStat: number;
  profileData: IProfileData;
  navigateTo?: (args: NavigateToParams) => void;
  showLoginModal: () => void;
  handleClose: () => void;
}

export const enum SelectedTab {
  FOLLOWERS = 0,
  FOLLOWING,
  INTERESTS,
}

const { StatModal, truncateMiddle } = DS;

const StatModalWrapper: React.FC<IStatModalWrapper> = props => {
  const { loginState, selectedStat, profileData, handleClose, navigateTo } = props;

  const [activeIndex, setActiveIndex] = React.useState<SelectedTab>(SelectedTab.FOLLOWERS);

  const { t } = useTranslation('app-profile');

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

  // get interests for this profile
  const interestsReq = useInterests(profileData.pubKey);
  /* @Todo: fix my type ;/ */
  const interests: any = interestsReq.data;

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

  // get tag subscriptions for logged user
  const tagSubscriptionsReq = useTagSubscriptions(loginState?.isReady && loginState?.ethAddress);

  const tagSubscriptions = tagSubscriptionsReq.data;

  const toggleTagSubscriptionReq = useToggleTagSubscription();

  // hooks to follow/unfollow profiles
  const followProfileReq = useFollow();
  const unfollowProfileReq = useUnfollow();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(() => setActiveIndex(selectedStat), []);

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

  const handleTagClick = (tagName: string) => {
    // close current modal before navigation
    handleClose();
    navigateTo?.({
      appName: '@akashaorg/app-akasha-integration',
      getNavigationUrl: navRoutes => `${navRoutes.Tags}/${tagName}`,
    });
  };

  const handleTagSubscribe = (tagName: string) => {
    if (!loginState.ethAddress) {
      handleClose();
      props.showLoginModal();
      return;
    }
    toggleTagSubscriptionReq.mutate(tagName);
  };

  const handleProfileClick = (pubKey: string) => {
    handleClose();
    navigateTo?.({
      appName: '@akashaorg/app-profile',
      getNavigationUrl: navRoutes => `${navRoutes.rootRoute}/${pubKey}`,
    });
  };

  const handleFollowProfile = (pubKey: string) => {
    if (!loginState.ethAddress) {
      handleClose();
      props.showLoginModal();
      return;
    }
    followProfileReq.mutate(pubKey);
  };

  const handleUnfollowProfile = (pubKey: string) => {
    if (!loginState.ethAddress) {
      handleClose();
      props.showLoginModal();
      return;
    }
    unfollowProfileReq.mutate(pubKey);
  };

  const handleButtonClick = () => {
    /* TODO:  */
  };

  const currentTabName = React.useMemo(() => {
    if (activeIndex === SelectedTab.FOLLOWERS) {
      return t('followers');
    }
    if (activeIndex === SelectedTab.FOLLOWING) {
      return t('following');
    }
    if (activeIndex === SelectedTab.INTERESTS) {
      return t('interests');
    }
  }, [activeIndex, t]);

  const placeholderStrings = React.useMemo(() => {
    if (loginState.ethAddress === profileData.ethAddress) {
      if (activeIndex === SelectedTab.FOLLOWERS) {
        return {
          title: t('You do not have followers yet'),
          subtitle: t('When you have followers, they will be listed here.'),
        };
      }
      if (activeIndex === SelectedTab.FOLLOWING) {
        return {
          title: t('You are not following anyone yet'),
          subtitle: t(
            'Go to the feed or search for some trending profiles to start following someone',
          ),
        };
      }
      if (activeIndex === SelectedTab.INTERESTS) {
        return {
          title: t('You do not have any topics yet'),
          subtitle: t('Go to the feed or search for some trending topics and subscribe to them'),
        };
      }
    }
    if (loginState.ethAddress !== profileData.ethAddress) {
      const displayName = `${
        profileData.name || `@${profileData.userName}` || truncateMiddle(profileData.ethAddress)
      }`;
      if (activeIndex === SelectedTab.FOLLOWERS) {
        return {
          title: `${displayName} ${t('has no followers yet')}`,
        };
      }
      if (activeIndex === SelectedTab.FOLLOWING) {
        return {
          title: `${displayName} ${t('is not following anyone yet')}`,
        };
      }
      if (activeIndex === SelectedTab.INTERESTS) {
        return {
          title: `${displayName} ${t('does not have any topics yet')}`,
        };
      }
    }
  }, [
    loginState.ethAddress,
    profileData.ethAddress,
    profileData.name,
    profileData.userName,
    activeIndex,
    t,
  ]);

  return (
    <StatModal
      activeIndex={activeIndex}
      setActiveIndex={setActiveIndex}
      loggedUser={loginState.pubKey}
      stats={[profileData.totalFollowers, profileData.totalFollowing, profileData.totalInterests]}
      titleLabel={
        profileData.name || profileData.userName || truncateMiddle(profileData.ethAddress)
      }
      tabLabelsArr={[t('Followers'), t('Following'), t('Topics')]}
      errorTitleLabel={t("Sorry, we can't fetch the {{currentTabName}} list.", { currentTabName })}
      errorSubtitleLabel={t("We can't display the list at the moment, please try again.")}
      placeholderTitleLabel={placeholderStrings.title}
      placeholderSubtitleLabel={placeholderStrings.subtitle}
      buttonLabel={t('Try again')}
      followers={followers}
      following={following}
      interests={interests}
      followersReqStatus={followersReq}
      followingReqStatus={followingReq}
      interestsReqStatus={interestsReq}
      followedProfiles={followedProfiles}
      subscribedTags={tagSubscriptions}
      followLabel={t('Follow')}
      followingLabel={t('Following')}
      unfollowLabel={t('Unfollow')}
      subscribeLabel={t('Subscribe')}
      subscribedLabel={t('Subscribed')}
      unsubscribeLabel={t('Unsubscribe')}
      tagAnchorLink={'/@akashaorg/app-akasha-integration/tags'}
      profileAnchorLink={'/@akashaorg/app-profile'}
      loadingMoreLabel={`${t('Loading more')} ...`}
      loadMoreFollowers={loadMoreFollowers}
      loadMoreFollowing={loadMoreFollowing}
      closeModal={handleClose}
      onClickTag={handleTagClick}
      onClickProfile={handleProfileClick}
      handleButtonClick={handleButtonClick}
      handleSubscribeTag={handleTagSubscribe}
      handleUnsubscribeTag={handleTagSubscribe}
      handleFollowProfile={handleFollowProfile}
      handleUnfollowProfile={handleUnfollowProfile}
    />
  );
};

export default StatModalWrapper;

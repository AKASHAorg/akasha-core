import React from 'react';
import singleSpa from 'single-spa';
import { useTranslation } from 'react-i18next';

import DS from '@akashaproject/design-system';
import { truncateMiddle } from '@akashaproject/design-system/lib/utils/string-utils';
import { IProfileData } from '@akashaproject/ui-awf-typings/src/profile';
import {
  useFollowers,
  useFollowing,
  useInterests,
} from '@akashaproject/ui-awf-hooks/lib/use-profile.new';
import {
  useTagSubscriptions,
  useToggleTagSubscription,
} from '@akashaproject/ui-awf-hooks/lib/use-tag.new';

import { LoginState } from '@akashaproject/ui-awf-hooks/lib/use-login.new';
import {
  useFollow,
  useIsFollowingMultiple,
  useUnfollow,
} from '@akashaproject/ui-awf-hooks/lib/use-follow.new';
import getSDK from '@akashaproject/awf-sdk';

interface IStatModalWrapper {
  loginState: LoginState;
  selectedStat: number;
  profileData: IProfileData;
  singleSpa: typeof singleSpa;
  showLoginModal: () => void;
  handleClose: () => void;
}

export const enum SelectedTab {
  FOLLOWERS = 0,
  FOLLOWING,
  INTERESTS,
}

const { StatModal } = DS;

const StatModalWrapper: React.FC<IStatModalWrapper> = props => {
  const { loginState, selectedStat, profileData, singleSpa, handleClose } = props;

  const [activeIndex, setActiveIndex] = React.useState<SelectedTab>(SelectedTab.FOLLOWERS);

  const { t } = useTranslation();

  const sdk = getSDK();

  // get followers for this profile
  const followersReq = useFollowers(profileData.pubKey, 10);
  const followers = followersReq.data?.pages[0].results;

  // get accounts this profile is following
  const followingReq = useFollowing(profileData.pubKey, 10);
  const following = followingReq.data?.pages[0].results;

  // get interests for this profile
  const interestsReq = useInterests(profileData.pubKey);
  const interests = interestsReq.data;

  let profiles: IProfileData[] = [];

  // wait for followers and following queries to finish
  if (Array.isArray(followers)) {
    profiles = [...profiles, ...followers];
  }
  if (Array.isArray(following)) {
    profiles = [...profiles, ...following];
  }

  // get followed profiles for logged user
  const isFollowingMultipleReq = useIsFollowingMultiple(
    loginState.ethAddress,
    profiles.map((profile: { ethAddress: string }) => profile.ethAddress),
  );

  const followedProfiles = isFollowingMultipleReq.data;

  // get tag subscriptions for logged user
  const tagSubscriptionsReq = useTagSubscriptions(loginState?.isReady && loginState?.ethAddress);

  const tagSubscriptions = tagSubscriptionsReq.data;

  const toggleTagSubscriptionReq = useToggleTagSubscription();

  // hooks to follow/unfollow profiles
  const followProfileReq = useFollow();
  const unfollowProfileReq = useUnfollow();

  const ipfsGateway = sdk.services.common.ipfs.getSettings().gateway;

  const followersPages = React.useMemo(() => {
    if (followersReq.data) {
      return followersReq.data.pages;
    }
    return [];
  }, [followersReq.data]);

  const followingPages = React.useMemo(() => {
    if (followingReq.data) {
      return followingReq.data.pages;
    }
    return [];
  }, [followingReq.data]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(() => setActiveIndex(selectedStat), []);

  const loadMoreFollowers = React.useCallback(() => {
    if (!followersReq.isLoading && followersReq.hasNextPage) {
      followersReq.fetchNextPage();
    }
  }, [followersReq]);

  const loadMoreFollowing = React.useCallback(() => {
    if (!followingReq.isLoading && followingReq.hasNextPage) {
      followingReq.fetchNextPage();
    }
  }, [followingReq]);

  const handleTagClick = (tagName: string) => {
    // close current modal before navigation
    handleClose();
    singleSpa.navigateToUrl(`/social-app/tags/${tagName}`);
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
    singleSpa.navigateToUrl(`/profile/${pubKey}`);
  };

  const handleFollowProfile = (ethAddress: string) => {
    if (!loginState.ethAddress) {
      handleClose();
      props.showLoginModal();
      return;
    }
    followProfileReq.mutate(ethAddress);
  };

  const handleUnfollowProfile = (ethAddress: string) => {
    if (!loginState.ethAddress) {
      handleClose();
      props.showLoginModal();
      return;
    }
    unfollowProfileReq.mutate(ethAddress);
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
          title: t('You no followers yet'),
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
      ipfsGateway={ipfsGateway}
      loggedUser={loginState.pubKey}
      stats={[profileData.totalFollowers, profileData.totalFollowing, profileData.totalInterests]}
      titleLabel={
        profileData.name || profileData.userName || truncateMiddle(profileData.ethAddress)
      }
      tabLabelsArr={[t('Followers'), t('Following'), t('Topics')]}
      errorTitleLabel={t(`Sorry, we can't fetch the ${currentTabName} list.`)}
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
      tagAnchorLink={'/social-app/tags'}
      profileAnchorLink={'/profile'}
      followersPages={followersPages}
      followingPages={followingPages}
      loadingMoreLabel={t('Loading more ...')}
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

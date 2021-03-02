import * as React from 'react';
import DS from '@akashaproject/design-system';
import { RootComponentProps, IAkashaError } from '@akashaproject/ui-awf-typings';
import { useTranslation } from 'react-i18next';
import {
  useTrendingData,
  useLoginState,
  useFollow,
  useTagSubscribe,
} from '@akashaproject/ui-awf-hooks';

const { TrendingWidgetCard } = DS;

// export interface TrendingWidgetCardProps {}

const TrendingWidget: React.FC<RootComponentProps> = props => {
  const { globalChannel, sdkModules, logger, singleSpa } = props;

  const { t } = useTranslation();

  const [trendingData] = useTrendingData({
    sdkModules: sdkModules,
    onError: (err: IAkashaError) => {
      logger.error('useTrendingData error %j', err);
    },
  });

  const [loginState] = useLoginState({
    globalChannel: globalChannel,
    onError: (err: IAkashaError) => {
      logger.error('useLoginState error %j', err);
    },
    authService: sdkModules.auth.authService,
    ipfsService: sdkModules.commons.ipfsService,
    profileService: sdkModules.profiles.profileService,
  });

  const [followedProfiles, followActions] = useFollow({
    globalChannel,
    profileService: sdkModules.profiles.profileService,
    onError: (errorInfo: IAkashaError) => {
      logger.error(errorInfo.error.message, errorInfo.errorKey);
    },
  });

  const [tagSubscriptionState, tagSubscriptionActions] = useTagSubscribe({
    globalChannel,
    profileService: sdkModules.profiles.profileService,
    onError: (errorInfo: IAkashaError) => {
      logger.error(errorInfo.error.message, errorInfo.errorKey);
    },
  });

  React.useEffect(() => {
    if (loginState.ethAddress) {
      trendingData.profiles.slice(0, 4).forEach(async (profile: any) => {
        if (loginState.ethAddress && profile.ethAddress) {
          followActions.isFollowing(loginState.ethAddress, profile.ethAddress);
        }
      });
    }
  }, [trendingData, loginState.ethAddress]);

  React.useEffect(() => {
    if (loginState.ready && loginState.ready.ethAddress) {
      tagSubscriptionActions.getTagSubscriptions();
    }
  }, [loginState.currentUserCalled && loginState.ethAddress]);

  const handleTagClick = () => {
    // todo
  };
  const handleTagSubscribe = (tagName: string) => {
    tagSubscriptionActions.toggleTagSubscription(tagName);
  };
  const handleTagUnsubscribe = (tagName: string) => {
    tagSubscriptionActions.toggleTagSubscription(tagName);
  };
  const handleProfileClick = (pubKey: string) => {
    singleSpa.navigateToUrl(`/profile/${pubKey}`);
  };
  const handleFollowProfile = (ethAddress: string) => {
    followActions.follow(ethAddress);
  };

  const handleUnfollowProfile = (ethAddress: string) => {
    followActions.unfollow(ethAddress);
  };

  return (
    <TrendingWidgetCard
      titleLabel={t('Trending Right Now')}
      topicsLabel={t('Topics')}
      profilesLabel={t('People')}
      followLabel={t('Follow')}
      unfollowLabel={t('Unfollow')}
      followersLabel={t('Followers')}
      followingLabel={t('Following')}
      tags={trendingData.tags}
      profiles={trendingData.profiles}
      followedProfiles={followedProfiles}
      subscribedTags={tagSubscriptionState}
      onClickTag={handleTagClick}
      handleSubscribeTag={handleTagSubscribe}
      handleUnsubscribeTag={handleTagUnsubscribe}
      onClickProfile={handleProfileClick}
      handleFollowProfile={handleFollowProfile}
      handleUnfollowProfile={handleUnfollowProfile}
      loggedEthAddress={loginState.ethAddress}
    />
  );
};

export default TrendingWidget;

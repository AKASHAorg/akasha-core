import * as React from 'react';
import DS from '@akashaproject/design-system';
import { RootComponentProps } from '@akashaproject/ui-awf-typings';
import { useTranslation } from 'react-i18next';
import {
  useTrendingData,
  useLoginState,
  useFollow,
  useTagSubscribe,
} from '@akashaproject/ui-awf-hooks';
import useErrorState from '@akashaproject/ui-awf-hooks/lib/use-error-state';

const { TrendingWidgetCard, ErrorInfoCard, ErrorLoader } = DS;

const TrendingWidget: React.FC<RootComponentProps> = props => {
  const { globalChannel, sdkModules, logger, singleSpa } = props;

  const { t } = useTranslation();

  const [errorState, errorActions] = useErrorState({ logger });

  const [trendingData] = useTrendingData({
    sdkModules: sdkModules,
    onError: errorActions.createError,
  });

  const [loginState] = useLoginState({
    globalChannel: globalChannel,
    onError: errorActions.createError,
    authService: sdkModules.auth.authService,
    ipfsService: sdkModules.commons.ipfsService,
    profileService: sdkModules.profiles.profileService,
  });

  const [followedProfiles, followActions] = useFollow({
    globalChannel,
    profileService: sdkModules.profiles.profileService,
    onError: errorActions.createError,
  });

  const [tagSubscriptionState, tagSubscriptionActions] = useTagSubscribe({
    globalChannel,
    profileService: sdkModules.profiles.profileService,
    onError: errorActions.createError,
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
    if (loginState.waitForAuth && !loginState.ready) {
      return;
    }
    if (
      (loginState.waitForAuth && loginState.ready) ||
      (loginState.currentUserCalled && loginState.ethAddress)
    ) {
      tagSubscriptionActions.getTagSubscriptions();
    }
  }, [JSON.stringify(loginState)]);

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
    <ErrorInfoCard errors={errorState}>
      {(errMessages, hasCriticalErrors) => (
        <>
          {(hasCriticalErrors || errMessages) && (
            <ErrorLoader
              type="script-error"
              title={t('Oops, this widget has an error')}
              details={
                hasCriticalErrors
                  ? t('An issue prevented this widget to be displayed')
                  : t('Some functionality of this widget may not work properly')
              }
              devDetails={errMessages}
            />
          )}
          {!hasCriticalErrors && !errMessages && (
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
          )}
        </>
      )}
    </ErrorInfoCard>
  );
};

export default TrendingWidget;

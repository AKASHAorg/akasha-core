import * as React from 'react';
import DS from '@akashaproject/design-system';
import { useTranslation } from 'react-i18next';
import {
  useTrendingData,
  useLoginState,
  useFollow,
  useTagSubscribe,
} from '@akashaproject/ui-awf-hooks';
import useErrorState from '@akashaproject/ui-awf-hooks/lib/use-error-state';
import { RootComponentProps } from '@akashaproject/ui-awf-typings';

const { TrendingWidgetCard, ErrorInfoCard, ErrorLoader } = DS;

const TrendingWidgetComponent: React.FC<RootComponentProps> = props => {
  const { logger, singleSpa } = props;

  const { t } = useTranslation();

  const [errorState, errorActions] = useErrorState({ logger });

  const [trendingData] = useTrendingData({
    onError: errorActions.createError,
  });

  const [loginState] = useLoginState({
    onError: errorActions.createError,
  });

  const [followedProfiles, followActions] = useFollow({
    onError: errorActions.createError,
  });

  const [tagSubscriptionState, tagSubscriptionActions] = useTagSubscribe({
    onError: errorActions.createError,
  });

  const showLoginModal = () => {
    props.navigateToModal({ name: 'login' });
  };

  React.useEffect(() => {
    if (loginState.ethAddress) {
      const followEthAddressArr = trendingData.profiles
        .slice(0, 4)
        .map((profile: { ethAddress: string }) => profile.ethAddress);
      followActions.isFollowingMultiple(loginState.ethAddress, followEthAddressArr);
    }
  }, [trendingData, loginState.ethAddress]);

  React.useEffect(() => {
    if (loginState.waitForAuth && !loginState.ready) {
      return;
    }
    if (loginState.ready) {
      tagSubscriptionActions.getTagSubscriptions();
    }
  }, [
    loginState.currentUserCalled,
    loginState.ethAddress,
    loginState.ready,
    loginState.waitForAuth,
  ]);

  const handleTagClick = (tagName: string) => {
    singleSpa.navigateToUrl(`/social-app/tags/${tagName}`);
  };

  const handleTagSubscribe = (tagName: string) => {
    if (!loginState.ethAddress) {
      showLoginModal();
      return;
    }
    tagSubscriptionActions.toggleTagSubscription(tagName);
  };
  const handleTagUnsubscribe = (tagName: string) => {
    if (!loginState.ethAddress) {
      showLoginModal();
      return;
    }
    tagSubscriptionActions.toggleTagSubscription(tagName);
  };
  const handleProfileClick = (pubKey: string) => {
    singleSpa.navigateToUrl(`/profile/${pubKey}`);
  };
  const handleFollowProfile = (ethAddress: string) => {
    if (!loginState.ethAddress) {
      showLoginModal();
      return;
    }
    followActions.follow(ethAddress);
  };

  const handleUnfollowProfile = (ethAddress: string) => {
    if (!loginState.ethAddress) {
      showLoginModal();
      return;
    }
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
              tagAnchorLink={'/social-app/tags'}
              profileAnchorLink={'/profile'}
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

export default TrendingWidgetComponent;

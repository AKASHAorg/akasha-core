import * as React from 'react';
import DS from '@akashaproject/design-system';
import { useTranslation } from 'react-i18next';
import { useLoginState } from '@akashaproject/ui-awf-hooks';
import {
  useTrendingTags,
  useTrendingProfiles,
} from '@akashaproject/ui-awf-hooks/lib/use-trending.new';
import {
  useTagSubscriptions,
  useToggleTagSubscription,
} from '@akashaproject/ui-awf-hooks/lib/use-tag-subscribe.new';
import {
  useIsFollowingMultiple,
  useFollow,
  useUnfollow,
} from '@akashaproject/ui-awf-hooks/lib/use-follow.new';
import useErrorState from '@akashaproject/ui-awf-hooks/lib/use-error-state';
import { RootComponentProps } from '@akashaproject/ui-awf-typings';

const { TrendingWidgetCard, ErrorInfoCard, ErrorLoader } = DS;

const TrendingWidgetComponent: React.FC<RootComponentProps> = props => {
  const { logger, singleSpa } = props;

  const { t } = useTranslation();

  const [errorState, errorActions] = useErrorState({ logger });

  const [loginState] = useLoginState({
    onError: errorActions.createError,
  });

  const trendingTagsReq = useTrendingTags();
  const trendingTags = trendingTagsReq.data || [];
  const trendingProfilesReq = useTrendingProfiles();
  const trendingProfiles = trendingProfilesReq.data || [];

  const followEthAddressArr = trendingProfiles
    .slice(0, 4)
    .map((profile: { ethAddress: string }) => profile.ethAddress);

  const isFollowingMultipleReq = useIsFollowingMultiple(loginState.ethAddress, followEthAddressArr);
  const followedProfiles = isFollowingMultipleReq.data;
  const followReq = useFollow();
  const unfollowReq = useUnfollow();

  const tagSubscriptionsReq = useTagSubscriptions(loginState.ready?.ethAddress);
  const tagSubscriptions = tagSubscriptionsReq.data;
  const toggleTagSubscriptionReq = useToggleTagSubscription();

  const showLoginModal = () => {
    props.navigateToModal({ name: 'login' });
  };

  const handleTagClick = (tagName: string) => {
    singleSpa.navigateToUrl(`/social-app/tags/${tagName}`);
  };

  const handleTagSubscribe = (tagName: string) => {
    if (!loginState.ethAddress) {
      showLoginModal();
      return;
    }
    toggleTagSubscriptionReq.mutate(tagName);
  };

  const handleProfileClick = (pubKey: string) => {
    singleSpa.navigateToUrl(`/profile/${pubKey}`);
  };
  const handleFollowProfile = (ethAddress: string) => {
    if (!loginState.ethAddress) {
      showLoginModal();
      return;
    }
    followReq.mutate(ethAddress);
  };

  const handleUnfollowProfile = (ethAddress: string) => {
    if (!loginState.ethAddress) {
      showLoginModal();
      return;
    }
    unfollowReq.mutate(ethAddress);
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
              tags={trendingTags}
              profiles={trendingProfiles}
              followedProfiles={followedProfiles}
              subscribedTags={tagSubscriptions}
              onClickTag={handleTagClick}
              handleSubscribeTag={handleTagSubscribe}
              handleUnsubscribeTag={handleTagSubscribe}
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

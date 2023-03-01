import React from 'react';
import { useTranslation } from 'react-i18next';

import DS from '@akashaorg/design-system';
import DSNew from '@akashaorg/design-system-core';
import { RootComponentProps, AnalyticsCategories } from '@akashaorg/typings/ui';

import {
  useTrendingTags,
  useTrendingProfiles,
  useTagSubscriptions,
  useToggleTagSubscription,
  useIsFollowingMultiple,
  useFollow,
  useUnfollow,
  useGetLogin,
  useAnalytics,
} from '@akashaorg/ui-awf-hooks';

import TrendingWidgetCard from './TrendingWidgetCard';

const { Box } = DS;

const { ErrorLoader } = DSNew;

const TrendingWidgetComponent: React.FC<RootComponentProps> = props => {
  const navigateTo = props.plugins['@akashaorg/app-routing']?.routing?.navigateTo;

  const { t } = useTranslation('ui-widget-trending');
  const loginQuery = useGetLogin();
  const [analyticsActions] = useAnalytics();

  const trendingTagsReq = useTrendingTags();
  const trendingTags = trendingTagsReq.data || [];
  const trendingProfilesReq = useTrendingProfiles();
  const trendingProfiles = trendingProfilesReq.data || [];

  const followPubKeyArr = trendingProfiles
    .slice(0, 4)
    .map((profile: { pubKey: string }) => profile.pubKey);

  const isFollowingMultipleReq = useIsFollowingMultiple(loginQuery.data?.pubKey, followPubKeyArr);
  const followedProfiles = isFollowingMultipleReq.data;
  const followReq = useFollow();
  const unfollowReq = useUnfollow();

  const tagSubscriptionsReq = useTagSubscriptions(
    loginQuery.data?.isReady && loginQuery.data?.ethAddress,
  );
  const tagSubscriptions = tagSubscriptionsReq.data;
  const toggleTagSubscriptionReq = useToggleTagSubscription();

  const showLoginModal = () => {
    props.navigateToModal({ name: 'login' });
  };

  const handleTagClick = (tagName: string) => {
    navigateTo?.({
      appName: '@akashaorg/app-akasha-integration',
      getNavigationUrl: navRoutes => `${navRoutes.Tags}/${tagName}`,
    });
  };

  const handleTagSubscribe = (tagName: string) => {
    if (!loginQuery.data?.ethAddress) {
      showLoginModal();
      return;
    }
    analyticsActions.trackEvent({
      category: AnalyticsCategories.TRENDING_WIDGET,
      action: 'Trending Topic Subscribed',
    });
    toggleTagSubscriptionReq.mutate(tagName);
  };
  const handleTagUnSubscribe = (tagName: string) => {
    if (!loginQuery.data?.ethAddress) {
      showLoginModal();
      return;
    }
    analyticsActions.trackEvent({
      category: AnalyticsCategories.TRENDING_WIDGET,
      action: 'Trending Topic Unsubscribed',
    });
    toggleTagSubscriptionReq.mutate(tagName);
  };

  const handleProfileClick = (pubKey: string) => {
    navigateTo?.({
      appName: '@akashaorg/app-profile',
      getNavigationUrl: navRoutes => `${navRoutes.rootRoute}/${pubKey}`,
    });
  };

  const handleFollowProfile = (pubKey: string) => {
    if (!loginQuery.data?.ethAddress) {
      showLoginModal();
      return;
    }
    analyticsActions.trackEvent({
      category: AnalyticsCategories.TRENDING_WIDGET,
      action: 'Trending People Followed',
    });
    followReq.mutate(pubKey);
  };

  const handleUnfollowProfile = (pubKey: string) => {
    if (!loginQuery.data?.ethAddress) {
      showLoginModal();
      return;
    }
    analyticsActions.trackEvent({
      category: AnalyticsCategories.TRENDING_WIDGET,
      action: 'Trending People Unfollowed',
    });
    unfollowReq.mutate(pubKey);
  };

  const handleActiveTabChange = (tab: number) => {
    if (tab === 0) {
      analyticsActions.trackEvent({
        category: AnalyticsCategories.TRENDING_WIDGET,
        action: 'Trending Topic Tab Selected',
      });
    } else {
      analyticsActions.trackEvent({
        category: AnalyticsCategories.TRENDING_WIDGET,
        action: 'Trending People Tab Selected',
      });
    }
  };

  return (
    <Box pad={{ bottom: 'small' }}>
      {(trendingTagsReq.isError || trendingProfilesReq.isError) && (
        <ErrorLoader
          type="script-error"
          title={t('Oops, this widget has an error')}
          details={
            trendingTagsReq.isError
              ? t('Cannot load trending topics')
              : t('Cannot load trending profiles')
          }
        />
      )}
      <TrendingWidgetCard
        titleLabel={t('Trending Right Now')}
        topicsLabel={t('Topics')}
        profilesLabel={t('People')}
        followLabel={t('Follow')}
        unfollowLabel={t('Unfollow')}
        followersLabel={t('Followers')}
        followingLabel={t('Following')}
        tagAnchorLink={'/@akashaorg/app-akasha-integration/tags'}
        profileAnchorLink={'/@akashaorg/app-profile'}
        noTagsLabel={t('No tags found!')}
        noProfilesLabel={t('No profiles found!')}
        isLoadingTags={trendingTagsReq.isFetching}
        isLoadingProfiles={trendingProfilesReq.isFetching}
        tags={trendingTags}
        profiles={trendingProfiles}
        followedProfiles={followedProfiles}
        subscribedTags={tagSubscriptions}
        onClickTag={handleTagClick}
        handleSubscribeTag={handleTagSubscribe}
        handleUnsubscribeTag={handleTagUnSubscribe}
        onClickProfile={handleProfileClick}
        handleFollowProfile={handleFollowProfile}
        handleUnfollowProfile={handleUnfollowProfile}
        loggedEthAddress={loginQuery.data?.ethAddress}
        onActiveTabChange={handleActiveTabChange}
      />
    </Box>
  );
};

export default TrendingWidgetComponent;

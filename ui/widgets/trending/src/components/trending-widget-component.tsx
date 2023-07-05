import React from 'react';
import { useTranslation } from 'react-i18next';

import { RootComponentProps, AnalyticsCategories } from '@akashaorg/typings/ui';
import {
  useTrendingTags,
  // useTrendingProfiles,
  useTagSubscriptions,
  useToggleTagSubscription,
  // useIsFollowingMultiple,
  // useFollow,
  // useUnfollow,
  useGetLogin,
  useAnalytics,
} from '@akashaorg/ui-awf-hooks';
import { useGetProfilesQuery } from '@akashaorg/ui-awf-hooks/lib/generated/hooks-new';

import Box from '@akashaorg/design-system-core/lib/components/Box';
import ErrorLoader from '@akashaorg/design-system-core/lib/components/ErrorLoader';

import { LatestProfiles, TrendingTags } from './cards';

const TrendingWidgetComponent: React.FC<RootComponentProps> = props => {
  const navigateTo = props.plugins['@akashaorg/app-routing']?.routing?.navigateTo;

  const { t } = useTranslation('ui-widget-trending');
  const loginQuery = useGetLogin();
  const [analyticsActions] = useAnalytics();

  const trendingTagsReq = useTrendingTags();
  const trendingTags = trendingTagsReq.data || [];

  const latestProfilesReq = useGetProfilesQuery(
    { last: 4 },
    { select: result => result?.profileIndex?.edges.map(profile => profile.node) },
  );

  const trendingProfiles = latestProfilesReq.data || [];

  // const followPubKeyArr = trendingProfiles
  //   .slice(0, 4)
  //   .map((profile: { pubKey: string }) => profile.pubKey);

  // const isFollowingMultipleReq = useIsFollowingMultiple(loginQuery.data?.pubKey, followPubKeyArr);
  // const followedProfiles = isFollowingMultipleReq.data;
  // const followReq = useFollow();
  // const unfollowReq = useUnfollow();

  const tagSubscriptionsReq = useTagSubscriptions(loginQuery.data?.id);
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

  const handleFollowProfile = (did: string) => {
    if (!loginQuery.data?.ethAddress) {
      showLoginModal();
      return;
    }

    analyticsActions.trackEvent({
      category: AnalyticsCategories.TRENDING_WIDGET,
      action: 'Trending People Followed',
    });

    // followReq.mutate(did);
  };

  const handleUnfollowProfile = (did: string) => {
    if (!loginQuery.data?.ethAddress) {
      showLoginModal();
      return;
    }

    analyticsActions.trackEvent({
      category: AnalyticsCategories.TRENDING_WIDGET,
      action: 'Trending People Unfollowed',
    });

    // unfollowReq.mutate(did);
  };

  return (
    <Box customStyle="space-y-4">
      {(trendingTagsReq.isError || latestProfilesReq.isError) && (
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

      {!trendingTagsReq.isError && (
        <TrendingTags
          titleLabel={t('Trending Topics')}
          tagSubtitleLabel={t('mentions')}
          subscribeLabel={t('Subscribe')}
          unsubscribeLabel={t('Unsubscribe')}
          noTagsLabel={t('No tags found!')}
          isLoadingTags={trendingTagsReq.isFetching}
          tags={trendingTags}
          subscribedTags={tagSubscriptions}
          onClickTag={handleTagClick}
          handleSubscribeTag={handleTagSubscribe}
          handleUnsubscribeTag={handleTagUnSubscribe}
        />
      )}

      {!latestProfilesReq.isError && (
        <LatestProfiles
          titleLabel={t('Latest Profiles')}
          followLabel={t('Follow')}
          unfollowLabel={t('Unfollow')}
          followersLabel={t('Followers')}
          noProfilesLabel={t('No profiles found!')}
          isLoadingProfiles={latestProfilesReq.isFetching}
          profiles={trendingProfiles}
          followedProfiles={['followedProfiles']}
          onClickProfile={handleProfileClick}
          handleFollowProfile={handleFollowProfile}
          handleUnfollowProfile={handleUnfollowProfile}
        />
      )}
    </Box>
  );
};

export default TrendingWidgetComponent;

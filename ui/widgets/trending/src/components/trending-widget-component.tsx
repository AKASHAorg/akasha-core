import React from 'react';
import { useTranslation } from 'react-i18next';

import { RootComponentProps, AnalyticsCategories } from '@akashaorg/typings/ui';
import {
  useTagSubscriptions,
  useToggleTagSubscription,
  useGetLogin,
  useAnalytics,
} from '@akashaorg/ui-awf-hooks';
import {
  useGetProfilesQuery,
  useGetInterestsQuery,
} from '@akashaorg/ui-awf-hooks/lib/generated/hooks-new';

import Box from '@akashaorg/design-system-core/lib/components/Box';
import ErrorLoader from '@akashaorg/design-system-core/lib/components/ErrorLoader';

import { LatestProfiles, LatestTopics } from './cards';

const TrendingWidgetComponent: React.FC<RootComponentProps> = props => {
  const { plugins, navigateToModal } = props;

  const navigateTo = plugins['@akashaorg/app-routing']?.routing?.navigateTo;

  const { t } = useTranslation('ui-widget-trending');
  const loginQuery = useGetLogin();

  const [analyticsActions] = useAnalytics();
  const latestProfilesReq = useGetProfilesQuery(
    { last: 4 },
    { select: result => result?.profileIndex?.edges.map(profile => profile.node) },
  );
  const latestTopicsReq = useGetInterestsQuery(
    { last: 4 },
    {
      select: result => result?.interestsIndex?.edges.flatMap(interest => interest.node?.topics),
    },
  );
  const tagSubscriptionsReq = useTagSubscriptions(loginQuery.data?.id);
  const toggleTagSubscriptionReq = useToggleTagSubscription();

  const latestProfiles = latestProfilesReq.data || [];
  const latestTopics = latestTopicsReq.data || [];

  const tagSubscriptions = tagSubscriptionsReq.data;

  const showLoginModal = () => {
    navigateToModal({ name: 'login' });
  };

  const handleTopicClick = (topic: string) => {
    navigateTo?.({
      appName: '@akashaorg/app-akasha-integration',
      getNavigationUrl: navRoutes => `${navRoutes.Tags}/${topic}`,
    });
  };

  const handleTopicSubscribe = (topic: string) => {
    if (!loginQuery.data?.ethAddress) {
      showLoginModal();
      return;
    }
    analyticsActions.trackEvent({
      category: AnalyticsCategories.TRENDING_WIDGET,
      action: 'Trending Topic Subscribed',
    });
    toggleTagSubscriptionReq.mutate(topic);
  };
  const handleTopicUnSubscribe = (topic: string) => {
    if (!loginQuery.data?.ethAddress) {
      showLoginModal();
      return;
    }
    analyticsActions.trackEvent({
      category: AnalyticsCategories.TRENDING_WIDGET,
      action: 'Trending Topic Unsubscribed',
    });
    toggleTagSubscriptionReq.mutate(topic);
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
      {(latestTopicsReq.isError || latestProfilesReq.isError) && (
        <ErrorLoader
          type="script-error"
          title={t('Oops, this widget has an error')}
          details={
            latestTopicsReq.isError
              ? t('Cannot load latest topics')
              : t('Cannot load latest profiles')
          }
        />
      )}

      {!latestTopicsReq.isError && (
        <LatestTopics
          titleLabel={t('Latest Topics')}
          tagSubtitleLabel={t('mentions')}
          subscribeLabel={t('Subscribe')}
          unsubscribeLabel={t('Unsubscribe')}
          noTagsLabel={t('No topics found!')}
          isLoadingTags={latestTopicsReq.isFetching}
          tags={latestTopics}
          subscribedTags={tagSubscriptions}
          onClickTopic={handleTopicClick}
          handleSubscribeTopic={handleTopicSubscribe}
          handleUnsubscribeTopic={handleTopicUnSubscribe}
        />
      )}

      {!latestProfilesReq.isError && (
        <LatestProfiles
          titleLabel={t('Start Following')}
          followLabel={t('Follow')}
          unfollowLabel={t('Unfollow')}
          followersLabel={t('Followers')}
          noProfilesLabel={t('No profiles found!')}
          isLoadingProfiles={latestProfilesReq.isFetching}
          profiles={latestProfiles}
          loggedUserDid={loginQuery?.data?.id}
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

import React from 'react';
import { useTranslation } from 'react-i18next';

import { AnalyticsCategories } from '@akashaorg/typings/ui';
import { useGetLogin, useAnalytics, useRootComponentProps } from '@akashaorg/ui-awf-hooks';
import {
  useGetProfilesQuery,
  useGetInterestsQuery,
  useGetInterestsByDidQuery,
  useCreateInterestsMutation,
} from '@akashaorg/ui-awf-hooks/lib/generated/hooks-new';
import { useQueryClient } from '@tanstack/react-query';

import Box from '@akashaorg/design-system-core/lib/components/Box';
import ErrorLoader from '@akashaorg/design-system-core/lib/components/ErrorLoader';

import { LatestProfiles, LatestTopics } from './cards';

const TrendingWidgetComponent = () => {
  const { plugins, navigateToModal } = useRootComponentProps();

  const navigateTo = plugins['@akashaorg/app-routing']?.routing?.navigateTo;

  const { t } = useTranslation('ui-widget-trending');
  const loginQuery = useGetLogin();
  const queryClient = useQueryClient();

  const [processingTags, setProcessingTags] = React.useState([]);

  const [analyticsActions] = useAnalytics();
  const latestProfilesReq = useGetProfilesQuery(
    { last: 4 },
    { select: result => result?.akashaProfileIndex?.edges.map(profile => profile.node) },
  );
  const latestTopicsReq = useGetInterestsQuery(
    { last: 4 },
    {
      select: result =>
        result?.akashaProfileInterestsIndex?.edges.flatMap(interest => interest.node?.topics),
    },
  );
  const tagSubscriptionsReq = useGetInterestsByDidQuery(
    { id: loginQuery.data?.id },
    {
      enabled: !!loginQuery.data?.id,
      select: resp => {
        const { interests } = resp.node as {
          interests: { topics: { value: string; labelType: string }[] };
        };

        return interests?.topics;
      },
    },
  );

  const createInterest = useCreateInterestsMutation({
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: useGetInterestsByDidQuery.getKey({ id: loginQuery.data?.id }),
      });
    },
  });

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

    setProcessingTags(prevState => [...prevState, topic]);
    createInterest
      .mutateAsync({
        i: { content: { topics: [...tagSubscriptions, { labelType: 'TOPIC', value: topic }] } },
      })
      .then(() => {
        setProcessingTags(prevState => prevState.filter(value => value !== topic));
      });
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

    setProcessingTags(prevState => [...prevState, topic]);

    createInterest
      .mutateAsync({
        i: { content: { topics: tagSubscriptions.filter(tag => tag.value !== topic) } },
      })
      .then(() => {
        setProcessingTags(prevState => prevState.filter(value => value !== topic));
      });
  };

  const handleProfileClick = (did: string) => {
    navigateTo?.({
      appName: '@akashaorg/app-profile',
      getNavigationUrl: navRoutes => `${navRoutes.rootRoute}/${did}`,
    });
  };

  const handleFollowProfile = () => {
    if (!loginQuery.data?.id) {
      showLoginModal();
      return;
    }

    analyticsActions.trackEvent({
      category: AnalyticsCategories.TRENDING_WIDGET,
      action: 'Trending People Followed',
    });

    // followReq.mutate(did);
  };

  const handleUnfollowProfile = () => {
    if (!loginQuery.data?.id) {
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
          subscribedLabel={t('Subscribed')}
          unsubscribeLabel={t('Unsubscribe')}
          noTagsLabel={t('No topics found!')}
          isLoadingTags={latestTopicsReq.isFetching}
          isProcessingTags={processingTags}
          tags={latestTopics}
          subscribedTags={tagSubscriptions?.map(el => el.value)}
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

import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { AnalyticsCategories } from '@akashaorg/typings/ui';
import {
  useGetLogin,
  useAnalytics,
  useRootComponentProps,
  getFollowList,
} from '@akashaorg/ui-awf-hooks';
import {
  useGetProfilesQuery,
  useGetInterestsQuery,
  useGetInterestsByDidQuery,
  useCreateInterestsMutation,
  useGetFollowDocumentsQuery,
} from '@akashaorg/ui-awf-hooks/lib/generated/hooks-new';
import { useQueryClient } from '@tanstack/react-query';

import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import ErrorLoader from '@akashaorg/design-system-core/lib/components/ErrorLoader';

import { LatestProfiles, LatestTopics } from './cards';

const TrendingWidgetComponent: React.FC<unknown> = () => {
  const { plugins, uiEvents, navigateToModal } = useRootComponentProps();

  const navigateTo = plugins['@akashaorg/app-routing']?.routing?.navigateTo;

  const { t } = useTranslation('ui-widget-trending');
  const loginQuery = useGetLogin();
  const queryClient = useQueryClient();

  const [processingTags, setProcessingTags] = useState([]);

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
        const { akashaProfileInterests } = resp.node as {
          akashaProfileInterests: { topics: { value: string; labelType: string }[] };
        };

        return akashaProfileInterests?.topics;
      },
    },
  );
  const latestProfiles = useMemo(() => latestProfilesReq.data || [], [latestProfilesReq.data]);
  const isLoggedIn = useMemo(() => {
    return !!loginQuery.data?.id;
  }, [loginQuery.data]);
  const followProfileIds = useMemo(
    () => latestProfiles.map(follower => follower.id),
    [latestProfiles],
  );
  const followDocumentsReq = useGetFollowDocumentsQuery(
    {
      following: followProfileIds,
      last: followProfileIds.length,
    },
    { select: response => response.viewer?.akashaFollowList, enabled: isLoggedIn },
  );
  const createInterest = useCreateInterestsMutation({
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: useGetInterestsByDidQuery.getKey({ id: loginQuery.data?.id }),
      });
    },
  });

  const latestTopics = latestTopicsReq.data || [];
  const tagSubscriptions = tagSubscriptionsReq.data;
  const followList = isLoggedIn
    ? getFollowList(followDocumentsReq.data?.edges?.map(edge => edge?.node))
    : null;

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

  return (
    <Stack spacing="gap-y-4">
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
          noProfilesLabel={t('No profiles found!')}
          isLoadingProfiles={latestProfilesReq.isFetching || followDocumentsReq.isFetching}
          profiles={latestProfiles}
          followList={followList}
          isLoggedIn={isLoggedIn}
          loggedUserDid={loginQuery?.data?.id}
          uiEvents={uiEvents}
          onClickProfile={handleProfileClick}
        />
      )}
    </Stack>
  );
};

export default TrendingWidgetComponent;

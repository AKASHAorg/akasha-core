import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { AnalyticsCategories } from '@akashaorg/typings/lib/ui';
import {
  useAnalytics,
  useRootComponentProps,
  getFollowList,
  useLoggedIn,
  hasOwn,
} from '@akashaorg/ui-awf-hooks';
import {
  useGetProfilesQuery,
  useGetFollowDocumentsQuery,
} from '@akashaorg/ui-awf-hooks/lib/generated';
import {
  useGetInterestsStreamQuery,
  useGetInterestsByDidQuery,
  useCreateInterestsMutation,
} from '@akashaorg/ui-awf-hooks/lib/generated/apollo';
//import { useQueryClient, useIsMutating } from '@tanstack/react-query';

import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import ErrorLoader from '@akashaorg/design-system-core/lib/components/ErrorLoader';

import { LatestProfiles, LatestTopics } from './cards';
import { SortOrder } from '@akashaorg/typings/lib/sdk/graphql-types-new';

const TrendingWidgetComponent: React.FC<unknown> = () => {
  const { plugins, uiEvents, navigateToModal } = useRootComponentProps();
  const navigateTo = plugins['@akashaorg/app-routing']?.routing?.navigateTo;

  const { t } = useTranslation('ui-widget-trending');
  const { isLoggedIn, authenticatedDID } = useLoggedIn();
  //const queryClient = useQueryClient();

  // const [tagsQueue, setTagsQueue] = useState([]);

  const [analyticsActions] = useAnalytics();
  const latestProfilesReq = useGetProfilesQuery(
    { last: 4 },
    { select: result => result?.akashaProfileIndex?.edges.map(profile => profile.node) },
  );
  const {
    data: latestTopicsReqData,
    loading: latestTopicsLoading,
    error: latestTopicsError,
    refetch,
  } = useGetInterestsStreamQuery(
    { variables: { last: 4, sorting: { createdAt: SortOrder.Desc } } },
    // {
    //   select: result =>
    //     result?.akashaInterestsStreamIndex?.edges.flatMap(interest => interest.node),
    // },
  );
  const {
    data: tagSubscriptionsData,
    loading: tagSubscriptionsLoading,
    error: tagSubscriptionsErrors,
    refetch: tagSubscriptionsRefetch,
  } = useGetInterestsByDidQuery({
    variables: { id: authenticatedDID },
    skip: !isLoggedIn,
    // onCompleted(data) {
    //   if (data && hasOwn(data.node, 'akashaProfileInterests'))
    //     return data.node.akashaProfileInterests.topics.map(topic => topic.value);
    // },
  });
  const latestProfiles = useMemo(() => latestProfilesReq.data || [], [latestProfilesReq.data]);
  const followProfileIds = useMemo(
    () => latestProfiles.map(follower => follower.id),
    [latestProfiles],
  );
  const followDocumentsReq = useGetFollowDocumentsQuery(
    {
      following: followProfileIds,
      last: followProfileIds.length,
    },
    {
      select: response => response.viewer?.akashaFollowList,
      enabled: isLoggedIn && !!followProfileIds.length,
    },
  );

  const latestTopics =
    latestTopicsReqData?.akashaInterestsStreamIndex?.edges.map(edge => edge.node.value) ?? [];
  const tagSubscriptions = useMemo(() => {
    if (!isLoggedIn) return [];
    return tagSubscriptionsData && hasOwn(tagSubscriptionsData.node, 'akashaProfileInterests')
      ? tagSubscriptionsData.node.akashaProfileInterests.topics.map(topic => topic.value)
      : [];
  }, [isLoggedIn, tagSubscriptionsData]);

  const subscriptionId = useMemo(() => {
    if (!isLoggedIn) return null;
    return tagSubscriptionsData && hasOwn(tagSubscriptionsData.node, 'akashaProfileInterests')
      ? tagSubscriptionsData.node.akashaProfileInterests.id
      : null;
  }, [isLoggedIn, tagSubscriptionsData]);

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

  useEffect(() => {
    console.log('latestTopicsReqData', latestTopicsReqData);
  }, [latestTopicsReqData]);

  const handleProfileClick = (did: string) => {
    navigateTo?.({
      appName: '@akashaorg/app-profile',
      getNavigationUrl: navRoutes => `${navRoutes.rootRoute}/${did}`,
    });
  };

  return (
    <Stack spacing="gap-y-4">
      {(latestTopicsError || latestProfilesReq.isError) && (
        <ErrorLoader
          type="script-error"
          title={t('Oops, this widget has an error')}
          details={
            latestTopicsError ? t('Cannot load latest topics') : t('Cannot load latest profiles')
          }
        />
      )}

      {!latestTopicsError && (
        <LatestTopics
          titleLabel={t('Latest Topics')}
          tagSubtitleLabel={t('mentions')}
          subscribeLabel={t('Subscribe')}
          subscribedLabel={t('Subscribed')}
          unsubscribeLabel={t('Unsubscribe')}
          noTagsLabel={t('No topics found!')}
          isLoadingTags={latestTopicsLoading}
          //  isProcessingTags={}
          tags={latestTopics}
          subscribedTags={tagSubscriptions}
          onClickTopic={handleTopicClick}
          // handleSubscribeTopic={handleTopicSubscribe}
          // handleUnsubscribeTopic={handleTopicUnSubscribe}
          tagSubscriptionsRefetch={tagSubscriptionsRefetch}
          subscriptionId={subscriptionId}
        />
      )}

      {!latestProfilesReq.isError && (
        <LatestProfiles
          titleLabel={t('Start Following')}
          noProfilesLabel={t('No profiles found!')}
          isLoadingProfiles={latestProfilesReq.isFetching}
          profiles={latestProfiles}
          followList={followList}
          isLoggedIn={isLoggedIn}
          authenticatedDID={authenticatedDID}
          uiEvents={uiEvents}
          onClickProfile={handleProfileClick}
        />
      )}
    </Stack>
  );
};

export default TrendingWidgetComponent;

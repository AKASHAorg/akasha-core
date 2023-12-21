import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useRootComponentProps, getFollowList, hasOwn, useGetLogin } from '@akashaorg/ui-awf-hooks';
import { useGetProfilesQuery } from '@akashaorg/ui-awf-hooks/lib/generated';
import {
  useGetInterestsStreamQuery,
  useGetInterestsByDidQuery,
  useGetFollowDocumentsByDidQuery,
} from '@akashaorg/ui-awf-hooks/lib/generated/apollo';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import ErrorBoundary from '@akashaorg/design-system-core/lib/components/ErrorBoundary';
import ErrorLoader from '@akashaorg/design-system-core/lib/components/ErrorLoader';
import { LatestProfiles, LatestTopics } from './cards';
import { useGetIndexingDID } from '@akashaorg/ui-awf-hooks/lib/use-settings';

const TrendingWidgetComponent: React.FC<unknown> = () => {
  const { t } = useTranslation('ui-widget-trending');
  const { data } = useGetLogin();
  const isLoggedIn = !!data?.id;
  const authenticatedDID = data?.id;
  const { plugins, uiEvents, navigateToModal } = useRootComponentProps();
  const navigateTo = plugins['@akashaorg/app-routing']?.routing?.navigateTo;

  const latestProfilesReq = useGetProfilesQuery(
    { last: 4 },
    { select: result => result?.akashaProfileIndex?.edges.map(profile => profile.node) },
  );
  const currentIndexingDID = useGetIndexingDID();
  const {
    data: latestTopicsReqData,
    loading: latestTopicsLoading,
    error: latestTopicsError,
  } = useGetInterestsStreamQuery({
    variables: {
      last: 4,
      indexer: currentIndexingDID,
    },
  });
  const { data: tagSubscriptionsData, refetch: refetchTagSubscriptions } =
    useGetInterestsByDidQuery({
      variables: { id: authenticatedDID },
      skip: !isLoggedIn,
    });
  const latestProfiles = useMemo(() => latestProfilesReq.data || [], [latestProfilesReq.data]);

  const followProfileIds = useMemo(
    () => latestProfiles.map(follower => follower.id),
    [latestProfiles],
  );

  const { data: followDocuments } = useGetFollowDocumentsByDidQuery({
    variables: {
      id: authenticatedDID,
      following: followProfileIds,
      last: followProfileIds.length,
    },
    skip: !isLoggedIn || !followProfileIds.length,
  });

  const latestTopics =
    latestTopicsReqData?.node && hasOwn(latestTopicsReqData.node, 'akashaInterestsStreamList')
      ? latestTopicsReqData?.node.akashaInterestsStreamList?.edges.map(edge => edge.node.value)
      : [];

  const tagSubscriptions = useMemo(() => {
    if (!isLoggedIn) return null;
    return tagSubscriptionsData &&
      hasOwn(tagSubscriptionsData.node, 'akashaProfileInterests') &&
      tagSubscriptionsData.node.akashaProfileInterests?.topics.length > 0
      ? tagSubscriptionsData.node.akashaProfileInterests?.topics.map(topic => topic.value)
      : [];
  }, [isLoggedIn, tagSubscriptionsData]);

  const tagSubscriptionsId = useMemo(() => {
    if (!isLoggedIn) return null;
    return tagSubscriptionsData && hasOwn(tagSubscriptionsData.node, 'akashaProfileInterests')
      ? tagSubscriptionsData.node.akashaProfileInterests?.id
      : null;
  }, [isLoggedIn, tagSubscriptionsData]);

  const followList = isLoggedIn
    ? getFollowList(
        followDocuments?.node && hasOwn(followDocuments.node, 'akashaFollowList')
          ? followDocuments.node?.akashaFollowList?.edges?.map(edge => edge?.node)
          : null,
      )
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
        <ErrorBoundary
          errorObj={{
            type: t('script-error'),
            title: t('Error in latest topics widget'),
            details: t('Unable to load widget now, try again later'),
          }}
        >
          <LatestTopics
            titleLabel={t('Latest Topics')}
            tagSubtitleLabel={t('mentions')}
            subscribeLabel={t('Subscribe')}
            subscribedLabel={t('Subscribed')}
            unsubscribeLabel={t('Unsubscribe')}
            noTagsLabel={t('No topics found!')}
            isLoadingTags={latestTopicsLoading}
            tags={latestTopics}
            receivedTags={tagSubscriptions}
            tagSubscriptionsId={tagSubscriptionsId}
            isLoggedIn={isLoggedIn}
            authenticatedDID={authenticatedDID}
            onClickTopic={handleTopicClick}
            showLoginModal={showLoginModal}
            refetchTagSubscriptions={refetchTagSubscriptions}
          />
        </ErrorBoundary>
      )}

      {!latestProfilesReq.isError && (
        <ErrorBoundary
          errorObj={{
            type: t('script-error'),
            title: t('Error in latest profiles widget'),
            details: t('Unable to load widget now, try again later'),
          }}
        >
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
        </ErrorBoundary>
      )}
    </Stack>
  );
};

export default TrendingWidgetComponent;

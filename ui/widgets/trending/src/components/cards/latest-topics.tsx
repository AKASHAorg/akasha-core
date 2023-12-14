import React, { useEffect, useRef, useState } from 'react';
import getSDK from '@akashaorg/awf-sdk';
import { AnalyticsCategories } from '@akashaorg/typings/lib/ui';
import { useAnalytics } from '@akashaorg/ui-awf-hooks';
import {
  useCreateInterestsMutation,
  useUpdateInterestsMutation,
} from '@akashaorg/ui-awf-hooks/lib/generated/apollo';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import TrendingWidgetLoadingCard from '@akashaorg/design-system-components/lib/components/TrendingWidgetLoadingCard';
import { TopicRow } from './topic-row';
import isEqual from 'lodash/isEqual';

export type LatestTopicsProps = {
  // data
  tags: string[];
  subscribedTags?: string[] | null;
  tagSubscriptionsId: string | null;
  isLoadingTags?: boolean;
  isLoggedIn: boolean;
  // labels
  noTagsLabel?: string;
  titleLabel: string;
  tagSubtitleLabel: string;
  subscribeLabel: string;
  subscribedLabel: string;
  unsubscribeLabel: string;
  // handlers
  onClickTopic: (topic: string) => void;
  showLoginModal: () => void;
};

export const LatestTopics: React.FC<LatestTopicsProps> = props => {
  const {
    onClickTopic,
    titleLabel,
    tagSubtitleLabel,
    tags,
    isLoadingTags,
    noTagsLabel,
    subscribeLabel,
    subscribedLabel,
    unsubscribeLabel,
    subscribedTags,
    tagSubscriptionsId,
    isLoggedIn,
    showLoginModal,
  } = props;

  const [subscribedInterests, setSubscribedInterests] = useState([]);
  const tagsInitialized = useRef(null);
  const [tagsQueue, setTagsQueue] = useState([]);
  let timer = null;
  const currentTags = useRef([]);

  useEffect(() => {
    if (subscribedTags.length > 0 && !tagsInitialized.current) {
      setSubscribedInterests(subscribedTags);
      tagsInitialized.current = true;
      currentTags.current = subscribedTags;
    }
  }, [subscribedTags, tagsInitialized]);

  const sdk = getSDK();
  const [analyticsActions] = useAnalytics();

  const [createInterestsMutation, { loading, error }] = useCreateInterestsMutation({
    context: { source: sdk.services.gql.contextSources.composeDB },
  });

  const [updateInterestsMutation, { loading: updateLoading, error: updateError }] =
    useUpdateInterestsMutation({
      context: { source: sdk.services.gql.contextSources.composeDB },
    });

  useEffect(() => {
    if (loading || updateLoading) return;

    if (!isEqual(subscribedInterests, subscribedTags))
      if (tagSubscriptionsId) {
        updateInterestsMutation({
          variables: {
            i: {
              id: tagSubscriptionsId,
              content: {
                topics: subscribedInterests.map(tag => ({ value: tag, labelType: 'TOPIC' })),
              },
            },
          },
          onCompleted: () => {
            setTagsQueue([]);
          },
        });
      } else {
        createInterestsMutation({
          variables: {
            i: {
              content: {
                topics: subscribedInterests.map(tag => ({ value: tag, labelType: 'TOPIC' })),
              },
            },
          },
          // onError: () => {
          //   setSubscribedInterests(prev => [...prev, tag]);
          // },
        });
      }
    // }
  }, [
    createInterestsMutation,
    loading,
    subscribedInterests,
    subscribedTags,
    tagSubscriptionsId,
    updateInterestsMutation,
    updateLoading,
  ]);

  const handleTopicSubscribe = (tag: string) => {
    if (!isLoggedIn) {
      showLoginModal();
      return;
    }

    const newInterests = [...currentTags.current, tag];

    currentTags.current = newInterests;
    tagsQueue.push(tag);

    if (timer != null) {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => setSubscribedInterests(currentTags.current), 300);
    } else {
      timer = window.setTimeout(() => setSubscribedInterests(currentTags.current), 300);
    }
  };

  const handleTopicUnsubscribe = (tag: string) => {
    if (!isLoggedIn) {
      showLoginModal();
      return;
    }
    const newInterests = currentTags.current.filter(topic => topic !== tag);

    currentTags.current = newInterests;

    tagsQueue.push(tag);

    if (timer != null) {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => setSubscribedInterests(currentTags.current), 300);
    } else {
      timer = window.setTimeout(() => setSubscribedInterests(currentTags.current), 300);
    }
  };

  if (tags.length === 0 && isLoadingTags) return <TrendingWidgetLoadingCard />;

  return (
    <Card padding={16}>
      <Stack customStyle="mb-4">
        <Text variant="button-md" weight="bold">
          {titleLabel}
        </Text>
      </Stack>

      <Stack>
        <ul>
          {tags.length === 0 && !isLoadingTags && (
            <Stack direction="column" spacing="gap-y-6" align="start">
              <Stack align="center" justify="center">
                <Text>{noTagsLabel}</Text>
              </Stack>
            </Stack>
          )}

          <Stack spacing="gap-y-4">
            {tags.length > 0 &&
              tags.slice(0, 4).map((tag, index) => (
                <TopicRow
                  key={index}
                  tag={tag}
                  subscribedTags={subscribedInterests}
                  tagSubtitleLabel={tagSubtitleLabel}
                  subscribeLabel={subscribeLabel}
                  subscribedLabel={subscribedLabel}
                  unsubscribeLabel={unsubscribeLabel}
                  isLoggedIn={isLoggedIn}
                  onClickTopic={onClickTopic}
                  isLoading={tagsQueue.includes(tag)}
                  // setSubscribedInterests={setSubscribedInterests}
                  showLoginModal={showLoginModal}
                  handleTopicUnsubscribe={handleTopicUnsubscribe}
                  handleTopicSubscribe={handleTopicSubscribe}
                />
              ))}
          </Stack>
        </ul>
      </Stack>
    </Card>
  );
};

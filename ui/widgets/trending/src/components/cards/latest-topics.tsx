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
  refetchTagSubscriptions: () => void;
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
    refetchTagSubscriptions,
  } = props;

  const [subscribedInterests, setSubscribedInterests] = useState([]);
  const subscriptionId = useRef(null);
  const tagsInitialized = useRef(null);
  const timer = useRef(null);
  const [tagsQueue, setTagsQueue] = useState([]);
  const currentTags = useRef([]);

  useEffect(() => {
    console.log('subscribedTags', subscribedTags);
    console.log('tagsInitialized.current', tagsInitialized.current);

    if (subscribedTags && !tagsInitialized.current) {
      setSubscribedInterests(subscribedTags);
      tagsInitialized.current = true;
      currentTags.current = subscribedTags;
    }
  }, [subscribedTags, tagsInitialized]);

  useEffect(() => {
    if (tagSubscriptionsId) {
      subscriptionId.current = tagSubscriptionsId;
    }
  }, [tagSubscriptionsId]);

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
    if (!tagsInitialized.current) return;
    if (loading || updateLoading) return;

    console.log('tagSubscriptionsId', tagSubscriptionsId);
    console.log('subscriptionId', subscriptionId.current);

    console.log('subscribedInterests', subscribedInterests, 'subscribedTags', subscribedTags);

    if (!isEqual(subscribedInterests, subscribedTags)) {
      if (subscriptionId.current) {
        updateInterestsMutation({
          variables: {
            i: {
              id: subscriptionId.current,
              content: {
                topics: subscribedInterests.map(tag => ({ value: tag, labelType: 'TOPIC' })),
              },
            },
          },
          optimisticResponse: {
            updateAkashaProfileInterests: {
              clientMutationId: null,
              document: {
                did: { id: 'did:pkh:eip155:5:0xe92bbe3e927f73106e57ed43fd3f2acf51035128' },
                topics: subscribedInterests.map(tag => ({ value: tag, labelType: 'TOPIC' })),
                id: subscriptionId.current,
              },
            },
          },
          onCompleted: data => {
            console.log('updatte data', data);
            setTagsQueue([]);
          },
          onError: () => {
            return null;
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
          onCompleted: data => {
            console.log('creatte data', data);
            const id = data.createAkashaProfileInterests?.document.id;
            console.log('id', id);
            subscriptionId.current = id;
            refetchTagSubscriptions();
          },
          onError: () => {
            return null;
          },
        });
      }
    }
  }, [loading, subscribedInterests, subscribedTags, tagSubscriptionsId, updateLoading]);

  const handleTopicSubscribe = (tag: string) => {
    if (!isLoggedIn) {
      showLoginModal();
      return;
    }
    setTagsQueue(prev => [...prev, tag]);

    const newInterests = [...currentTags.current, tag];

    currentTags.current = newInterests;

    console.log('timer', timer.current);

    if (timer.current !== null) {
      window.clearTimeout(timer.current);
    }
    timer.current = window.setTimeout(() => setSubscribedInterests(currentTags.current), 1000);
  };

  const handleTopicUnsubscribe = (tag: string) => {
    if (!isLoggedIn) {
      showLoginModal();
      return;
    }

    setTagsQueue(prev => [...prev, tag]);
    const newInterests = currentTags.current.filter(topic => topic !== tag);

    currentTags.current = newInterests;

    console.log('timer', timer.current);
    if (timer.current !== null) {
      window.clearTimeout(timer.current);
    }
    timer.current = window.setTimeout(() => setSubscribedInterests(currentTags.current), 1000);
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
            {['dogs', 'cats', 'chickens', 'birds'].length > 0 &&
              ['dogs', 'cats', 'chickens', 'birds'].slice(0, 4).map((tag, index) => (
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

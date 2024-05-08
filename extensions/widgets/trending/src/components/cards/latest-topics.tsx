import React, { useEffect, useRef, useState } from 'react';
import getSDK from '@akashaorg/awf-sdk';
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
import difference from 'lodash/difference';
import pullAll from 'lodash/pullAll';

export type LatestTopicsProps = {
  // data
  tags: string[];
  receivedTags?: string[] | null;
  tagSubscriptionsId: string | null;
  isLoadingTags?: boolean;
  isLoggedIn: boolean;
  authenticatedDID: string;
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
    receivedTags,
    tagSubscriptionsId,
    isLoggedIn,
    authenticatedDID,
    showLoginModal,
    refetchTagSubscriptions,
  } = props;

  const [tagsQueue, setTagsQueue] = useState([]);
  const [localSubscribedTags, setLocalSubscribedTags] = useState([]);
  const timer = useRef(null);
  const subscriptionId = useRef(null);
  const localTagsInitialized = useRef(null);
  const localSubscribedTagsRef = useRef([]);

  // reset state when user logs out
  useEffect(() => {
    if (!isLoggedIn) {
      setLocalSubscribedTags([]);
      localSubscribedTagsRef.current = [];
      localTagsInitialized.current = null;
      subscriptionId.current = null;
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (receivedTags && !localTagsInitialized.current) {
      setLocalSubscribedTags([...new Set(receivedTags)]);
      localTagsInitialized.current = true;
    }
    // prevents reseting interests with []
    if (receivedTags && tagsQueue.length === 0) {
      localSubscribedTagsRef.current = receivedTags;
    }
  }, [receivedTags, localTagsInitialized, tagsQueue.length]);

  useEffect(() => {
    if (tagSubscriptionsId) {
      subscriptionId.current = tagSubscriptionsId;
    }
  }, [tagSubscriptionsId]);

  const sdk = getSDK();

  const [createInterestsMutation, { loading }] = useCreateInterestsMutation({
    context: { source: sdk.services.gql.contextSources.composeDB },
  });

  const [updateInterestsMutation, { loading: updateLoading }] = useUpdateInterestsMutation({
    context: { source: sdk.services.gql.contextSources.composeDB },
  });

  useEffect(() => {
    if (!localTagsInitialized.current || receivedTags === null) return;
    if (loading || updateLoading) return;

    if (!isEqual(localSubscribedTagsRef.current, receivedTags)) {
      if (subscriptionId.current) {
        updateInterestsMutation({
          variables: {
            i: {
              id: subscriptionId.current,
              content: {
                topics: [...new Set(localSubscribedTagsRef.current)].map(tag => ({
                  value: tag,
                  labelType: sdk.services.gql.labelTypes.INTEREST,
                })),
              },
            },
          },
          optimisticResponse: {
            updateAkashaProfileInterests: {
              clientMutationId: null,
              document: {
                did: { id: authenticatedDID },
                topics: localSubscribedTagsRef.current.map(tag => ({
                  value: tag,
                  labelType: sdk.services.gql.labelTypes.INTEREST,
                })),
                id: subscriptionId.current,
              },
            },
          },
          onCompleted: data => {
            const returnedData = data.updateAkashaProfileInterests.document.topics.map(
              topic => topic.value,
            );

            const arrDifference = difference(returnedData, receivedTags).concat(
              difference(receivedTags, returnedData),
            );

            setTagsQueue(prev => pullAll(prev, arrDifference));
          },
          onError: () => {
            const arrDifference = receivedTags
              .filter(x => !localSubscribedTags.includes(x))
              .concat(localSubscribedTags.filter(x => !receivedTags.includes(x)));

            setTagsQueue(prev => pullAll(prev, arrDifference));
            refetchTagSubscriptions();
          },
        });
      } else {
        createInterestsMutation({
          variables: {
            i: {
              content: {
                topics: [...new Set(localSubscribedTagsRef.current)].map(tag => ({
                  value: tag,
                  labelType: sdk.services.gql.labelTypes.INTEREST,
                })),
              },
            },
          },
          onCompleted: data => {
            subscriptionId.current = data.createAkashaProfileInterests?.document.id;

            const returnedData = data.createAkashaProfileInterests?.document.topics.map(
              topic => topic.value,
            );

            const arrDifference = difference(returnedData, localSubscribedTags).concat(
              difference(localSubscribedTags, returnedData),
            );

            setTagsQueue(prev => pullAll(prev, arrDifference));
            refetchTagSubscriptions();
          },
          onError: () => {
            const arrDifference = difference(receivedTags, localSubscribedTags).concat(
              difference(localSubscribedTags, receivedTags),
            );

            setTagsQueue(prev => pullAll(prev, arrDifference));
            refetchTagSubscriptions();
          },
        });
      }
    }
  }, [localSubscribedTags, updateLoading, loading]);

  const handleTopicSubscribe = (tag: string) => {
    if (!isLoggedIn) {
      showLoginModal();
      return;
    }
    setTagsQueue(prev => [...prev, tag]);

    const newInterests = [...localSubscribedTagsRef.current, tag];

    localSubscribedTagsRef.current = newInterests;

    if (timer.current !== null) {
      window.clearTimeout(timer.current);
    }
    timer.current = window.setTimeout(
      () => setLocalSubscribedTags(localSubscribedTagsRef.current),
      700,
    );
  };

  const handleTopicUnsubscribe = (tag: string) => {
    if (!isLoggedIn) {
      showLoginModal();
      return;
    }

    setTagsQueue(prev => [...prev, tag]);
    const newInterests = localSubscribedTagsRef.current.filter(topic => topic !== tag);

    localSubscribedTagsRef.current = newInterests;

    if (timer.current !== null) {
      window.clearTimeout(timer.current);
    }
    timer.current = window.setTimeout(
      () => setLocalSubscribedTags(localSubscribedTagsRef.current),
      700,
    );
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
              tags
                .slice(0, 4)
                .map((tag, index) => (
                  <TopicRow
                    key={index}
                    tag={tag}
                    subscribedTags={receivedTags}
                    tagSubtitleLabel={tagSubtitleLabel}
                    subscribeLabel={subscribeLabel}
                    subscribedLabel={subscribedLabel}
                    unsubscribeLabel={unsubscribeLabel}
                    isLoggedIn={isLoggedIn}
                    onClickTopic={onClickTopic}
                    isLoading={tagsQueue.includes(tag)}
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

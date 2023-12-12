import React, { useEffect, useRef, useState } from 'react';
import getSDK from '@akashaorg/awf-sdk';
import { AnalyticsCategories } from '@akashaorg/typings/lib/ui';
import { useAnalytics } from '@akashaorg/ui-awf-hooks';
import { useCreateInterestsMutation } from '@akashaorg/ui-awf-hooks/lib/generated/apollo';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import TrendingWidgetLoadingCard from '@akashaorg/design-system-components/lib/components/TrendingWidgetLoadingCard';
import { TopicRow } from './topic-row';
import isEqual from 'lodash/isEqual';

export type LatestTopicsProps = {
  // data
  tags: string[];
  subscribedTags?: string[];
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
    isLoggedIn,
    showLoginModal,
  } = props;

  const [subscribedInterests, setSubscribedInterests] = useState([]);
  // const [subscribedTags, setSubscribedTags] = useState([]);
  const tagsInitialized = useRef(null);

  useEffect(() => {
    if (subscribedTags.length > 0 && !tagsInitialized.current) {
      console.log('subscribedTags', subscribedTags);
      setSubscribedInterests(subscribedTags);
      tagsInitialized.current = true;
    }
  }, [subscribedTags, tagsInitialized]);

  const sdk = getSDK();
  const [analyticsActions] = useAnalytics();

  const [createInterestsMutation, { data, loading, error }] = useCreateInterestsMutation({
    context: { source: sdk.services.gql.contextSources.composeDB },
  });

  useEffect(() => {
    if (subscribedInterests.length === 0) return;
    if (loading) return;
    console.log('subscribedInterests', subscribedInterests);
    console.log('subscribedTags', subscribedTags);

    if (!isEqual(subscribedTags, subscribedInterests)) {
      //setSubscribedTags(subscribedInterests);

      createInterestsMutation({
        variables: {
          i: {
            content: {
              topics: [...subscribedInterests.map(tag => ({ value: tag, labelType: 'TOPIC' }))],
            },
          },
        },
        onCompleted: data => {
          console.log('data success', data);
        },
        // onError: () => {
        //   setSubscribedInterests(prev => prev.filter(topic => topic !== tag));
        // },
      });
    }
  }, [subscribedTags, subscribedInterests, loading, createInterestsMutation]);

  const handleTopicSubscribe = (tag: string) => {
    if (!isLoggedIn) {
      showLoginModal();
      return;
    }

    const newInterests = [...subscribedInterests, tag];

    setSubscribedInterests(newInterests);

    if (loading) {
      return;
    }

    analyticsActions.trackEvent({
      category: AnalyticsCategories.TRENDING_WIDGET,
      action: 'Trending Topic Subscribed',
    });

    createInterestsMutation({
      variables: {
        i: {
          content: {
            topics: [...newInterests.map(tag => ({ value: tag, labelType: 'TOPIC' }))],
          },
        },
      },
      onError: () => {
        setSubscribedInterests(prev => prev.filter(topic => topic !== tag));
      },
    });
  };

  const handleTopicUnsubscribe = (tag: string) => {
    if (!isLoggedIn) {
      showLoginModal();
      return;
    }

    const newInterests = subscribedInterests.filter(topic => topic !== tag);

    setSubscribedInterests(newInterests);

    if (loading) {
      return;
    }

    analyticsActions.trackEvent({
      category: AnalyticsCategories.TRENDING_WIDGET,
      action: 'Trending Topic Unsubscribed',
    });

    createInterestsMutation({
      variables: {
        i: {
          content: {
            topics: newInterests.map(tag => ({ value: tag, labelType: 'TOPIC' })),
          },
        },
      },
      onError: () => {
        setSubscribedInterests(prev => [...prev, tag]);
      },
    });
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
            {['eth', 'coin', 'social', 'dogs'].length !== 0 &&
              ['eth', 'coin', 'social', 'dogs'].slice(0, 4).map((tag, index) => (
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
                  isLoading={false}
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

import React, { useState } from 'react';
import getSDK from '@akashaorg/awf-sdk';
import {
  CreateInterestsDocument,
  GetInterestsByDidDocument,
  useCreateInterestsMutation,
  useUpdateInterestsMutation,
} from '@akashaorg/ui-awf-hooks/lib/generated/apollo';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import {
  CheckIcon,
  HashtagIcon,
  XMarkIcon,
} from '@akashaorg/design-system-core/lib/components/Icon/hero-icons-outline';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import SubtitleTextIcon from '@akashaorg/design-system-core/lib/components/SubtitleTextIcon';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import DuplexButton from '@akashaorg/design-system-core/lib/components/DuplexButton';

export type TopicRowProps = {
  tag: string;
  subscribedTags?: any;
  subscriptionId: string | null;
  isLoadingTags?: boolean;
  isProcessingTags?: string[];
  // labels
  noTagsLabel?: string;
  tagSubtitleLabel: string;
  subscribeLabel: string;
  subscribedLabel: string;
  unsubscribeLabel: string;
  // handlers
  onClickTopic: (topic: string) => void;
  tagSubscriptionsRefetch: () => void;
};

export const TopicRow: React.FC<TopicRowProps> = props => {
  const {
    tagSubtitleLabel,
    tag,
    subscriptionId,
    isLoadingTags,
    isProcessingTags,
    noTagsLabel,
    subscribeLabel,
    subscribedLabel,
    unsubscribeLabel,
    subscribedTags,
    onClickTopic,
    tagSubscriptionsRefetch,
  } = props;

  const sdk = getSDK();
  console.log('subscribedTags', subscribedTags);

  const [createInterestsMutation, { data, loading, error }] = useCreateInterestsMutation({
    context: { source: sdk.services.gql.contextSources.composeDB },
    // refetchQueries: [{ query: GetInterestsByDidDocument }],
    // awaitRefetchQueries: true,
  });

  const [
    updateInterestsMutation,
    { data: updateData, loading: updateLoading, error: updateError },
  ] = useUpdateInterestsMutation({
    context: { source: sdk.services.gql.contextSources.composeDB },
    // refetchQueries: [{ query: GetInterestsByDidDocument }],
    // awaitRefetchQueries: true,
  });

  const handleTopicSubscribe = () => {
    // if (!isLoggedIn) {
    //   showLoginModal();
    //   return;
    // }
    // analyticsActions.trackEvent({
    //   category: AnalyticsCategories.TRENDING_WIDGET,
    //   action: 'Trending Topic Subscribed',
    // });

    createInterestsMutation({
      variables: {
        i: {
          content: {
            topics: [
              ...subscribedTags.map(tag => ({ value: tag, labelType: 'TOPIC' })),
              { value: tag, labelType: 'TOPIC' },
            ],
          },
        },
      },
      onCompleted(data, clientOptions) {
        console.log(' handleTopicSubscribe mutation data', data);
        tagSubscriptionsRefetch();
      },
    });
  };

  const handleTopicUnsubscribe = () => {
    // if (!isLoggedIn) {
    //   showLoginModal();
    //   return;
    // }
    // analyticsActions.trackEvent({
    //   category: AnalyticsCategories.TRENDING_WIDGET,
    //   action: 'Trending Topic Subscribed',
    // });

    updateInterestsMutation({
      variables: {
        i: {
          id: subscriptionId,
          content: {
            topics: subscribedTags
              .filter(topic => topic !== tag)
              .map(tag => ({ value: tag, labelType: 'TOPIC' })),
          },
        },
      },
      onCompleted(data, clientOptions) {
        console.log('handleTopicUnsubscribe mutation data', data);
        tagSubscriptionsRefetch();
      },
    });
  };

  return (
    <Stack
      direction="row"
      align="center"
      justify="between"
      spacing="gap-x-3"
      customStyle="w-(full xl:[19rem])"
    >
      <SubtitleTextIcon
        label={tag}
        subtitle={`0 ${tagSubtitleLabel}`}
        icon={<HashtagIcon />}
        backgroundColor={true}
        onClick={() => onClickTopic(tag)}
      />

      <DuplexButton
        inactiveLabel={subscribeLabel}
        activeLabel={subscribedLabel}
        activeHoverLabel={unsubscribeLabel}
        active={subscribedTags?.includes(tag)}
        iconDirection="left"
        activeIcon={<CheckIcon />}
        activeHoverIcon={<XMarkIcon />}
        inactiveVariant="secondary"
        loading={loading || updateLoading}
        hoverColors={{
          background: { light: 'transparent', dark: 'transparent' },
          border: { light: 'errorLight', dark: 'errorDark' },
          text: { light: 'errorLight', dark: 'errorDark' },
          icon: { light: 'errorLight', dark: 'errorDark' },
        }}
        fixedWidth={'w-[7rem]'}
        onClickActive={() => handleTopicUnsubscribe()}
        onClickInactive={() => handleTopicSubscribe()}
      />
    </Stack>
  );
};

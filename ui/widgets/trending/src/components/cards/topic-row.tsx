import React from 'react';
import getSDK from '@akashaorg/awf-sdk';
import { AnalyticsCategories } from '@akashaorg/typings/lib/ui';
import { useAnalytics } from '@akashaorg/ui-awf-hooks';
import {
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
import DuplexButton from '@akashaorg/design-system-core/lib/components/DuplexButton';

export type TopicRowProps = {
  tag: string;
  subscribedTags?: any;
  // labels
  noTagsLabel?: string;
  tagSubtitleLabel: string;
  subscribeLabel: string;
  subscribedLabel: string;
  unsubscribeLabel: string;
  isLoggedIn: boolean;
  // handlers
  onClickTopic: (topic: string) => void;
  setSubscribedInterests: React.Dispatch<React.SetStateAction<string[]>>;
  showLoginModal: () => void;
};

export const TopicRow: React.FC<TopicRowProps> = props => {
  const {
    tagSubtitleLabel,
    tag,
    subscribeLabel,
    subscribedLabel,
    unsubscribeLabel,
    subscribedTags,
    isLoggedIn,
    onClickTopic,
    setSubscribedInterests,
    showLoginModal,
  } = props;

  const sdk = getSDK();
  const [analyticsActions] = useAnalytics();

  const [createInterestsMutation, { data, loading, error }] = useCreateInterestsMutation({
    context: { source: sdk.services.gql.contextSources.composeDB },
  });

  const handleTopicSubscribe = () => {
    if (!isLoggedIn) {
      showLoginModal();
      return;
    }
    analyticsActions.trackEvent({
      category: AnalyticsCategories.TRENDING_WIDGET,
      action: 'Trending Topic Subscribed',
    });

    setSubscribedInterests(prev => [...prev, tag]);

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
      onError: () => {
        setSubscribedInterests(prev => prev.filter(topic => topic !== tag));
      },
    });
  };

  const handleTopicUnsubscribe = () => {
    if (!isLoggedIn) {
      showLoginModal();
      return;
    }
    analyticsActions.trackEvent({
      category: AnalyticsCategories.TRENDING_WIDGET,
      action: 'Trending Topic Unsubscribed',
    });

    setSubscribedInterests(prev => prev.filter(topic => topic !== tag));

    createInterestsMutation({
      variables: {
        i: {
          content: {
            topics: subscribedTags
              .filter(topic => topic !== tag)
              .map(tag => ({ value: tag, labelType: 'TOPIC' })),
          },
        },
      },
      onError: () => {
        setSubscribedInterests(prev => [...prev, tag]);
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
        loading={loading}
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

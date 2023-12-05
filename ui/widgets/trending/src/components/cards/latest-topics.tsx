import React, { useEffect, useState } from 'react';

import { Interest } from '@akashaorg/typings/lib/ui';

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
import TrendingWidgetLoadingCard from '@akashaorg/design-system-components/lib/components/TrendingWidgetLoadingCard';
import { TopicRow } from './topic-row';

export type LatestTopicsProps = {
  // data
  tags: string[];
  subscribedTags?: any;
  subscriptionId: string | null;
  isLoadingTags?: boolean;
  isProcessingTags?: string[];
  // labels
  noTagsLabel?: string;
  titleLabel: string;
  tagSubtitleLabel: string;
  subscribeLabel: string;
  subscribedLabel: string;
  unsubscribeLabel: string;
  // handlers
  onClickTopic: (topic: string) => void;
  handleSubscribeTopic?: (topic: string, topicList: string[]) => void;
  handleUnsubscribeTopic?: (topic: string, topicList: string[]) => void;
  tagSubscriptionsRefetch: () => void;
};

export const LatestTopics: React.FC<LatestTopicsProps> = props => {
  const {
    onClickTopic,
    handleSubscribeTopic,
    handleUnsubscribeTopic,
    tagSubscriptionsRefetch,
    titleLabel,
    tagSubtitleLabel,
    tags,
    subscriptionId,
    isLoadingTags,
    isProcessingTags,
    noTagsLabel,
    subscribeLabel,
    subscribedLabel,
    unsubscribeLabel,
    subscribedTags,
  } = props;

  const [subscribedInterests, setSubscribedInterests] = useState(null);

  useEffect(() => {
    if (subscribedTags) setSubscribedInterests(subscribedTags);
  }, [subscribedTags]);

  if (tags.length === 0 && isLoadingTags) return <TrendingWidgetLoadingCard />;
  //console.log('tags', tags);
  //console.log('subscribedTags', subscribedTags);

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
            {tags.length !== 0 &&
              tags.slice(0, 4).map((tag, index) => (
                <TopicRow
                  tag={tag}
                  subscribedTags={subscribedInterests}
                  subscriptionId={subscriptionId}
                  tagSubtitleLabel={tagSubtitleLabel}
                  subscribeLabel={subscribeLabel}
                  subscribedLabel={subscribedLabel}
                  unsubscribeLabel={unsubscribeLabel}
                  onClickTopic={onClickTopic}
                  tagSubscriptionsRefetch={tagSubscriptionsRefetch}
                />
                // <Stack
                //   key={index}
                //   direction="row"
                //   align="center"
                //   justify="between"
                //   spacing="gap-x-3"
                //   customStyle="w-(full xl:[19rem])"
                // >
                //   <SubtitleTextIcon
                //     label={tag}
                //     subtitle={`0 ${tagSubtitleLabel}`}
                //     icon={<HashtagIcon />}
                //     backgroundColor={true}
                //     onClick={() => onClickTopic(tag)}
                //   />

                //   <DuplexButton
                //     inactiveLabel={subscribeLabel}
                //     activeLabel={subscribedLabel}
                //     activeHoverLabel={unsubscribeLabel}
                //     active={subscribedInterests?.includes(tag)}
                //     iconDirection="left"
                //     activeIcon={<CheckIcon />}
                //     activeHoverIcon={<XMarkIcon />}
                //     inactiveVariant="secondary"
                //     loading={!!isProcessingTags?.find(processingTag => processingTag === tag.value)}
                //     hoverColors={{
                //       background: { light: 'transparent', dark: 'transparent' },
                //       border: { light: 'errorLight', dark: 'errorDark' },
                //       text: { light: 'errorLight', dark: 'errorDark' },
                //       icon: { light: 'errorLight', dark: 'errorDark' },
                //     }}
                //     fixedWidth={'w-[7rem]'}
                //     onClickActive={() => handleUnsubscribeTopic(tag, subscribedInterests)}
                //     onClickInactive={() => handleSubscribeTopic(tag, subscribedInterests)}
                //   />
                // </Stack>
              ))}
          </Stack>
        </ul>
      </Stack>
    </Card>
  );
};

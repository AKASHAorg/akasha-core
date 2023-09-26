import React from 'react';

import { Interest } from '@akashaorg/typings/lib/ui';

import Card from '@akashaorg/design-system-core/lib/components/Card';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import SubtitleTextIcon from '@akashaorg/design-system-core/lib/components/SubtitleTextIcon';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import TrendingWidgetButton from '@akashaorg/design-system-components/lib/components/TrendingWidgetButton';
import TrendingWidgetLoadingCard from '@akashaorg/design-system-components/lib/components/TrendingWidgetLoadingCard';

export type LatestTopicsProps = {
  // data
  tags: Interest[];
  subscribedTags?: string[];
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
  handleSubscribeTopic: (topic: string) => void;
  handleUnsubscribeTopic: (topic: string) => void;
};

export const LatestTopics: React.FC<LatestTopicsProps> = props => {
  const {
    onClickTopic,
    handleSubscribeTopic,
    handleUnsubscribeTopic,
    titleLabel,
    tagSubtitleLabel,
    tags,
    isLoadingTags,
    isProcessingTags,
    noTagsLabel,
    subscribeLabel,
    subscribedLabel,
    unsubscribeLabel,
    subscribedTags,
  } = props;

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
            <Stack align="center" justify="center">
              <Text>{noTagsLabel}</Text>
            </Stack>
          )}

          {tags.length === 0 &&
            isLoadingTags &&
            Array.from({ length: 4 }, (_el, index: number) => (
              <React.Fragment key={index}>
                <TrendingWidgetLoadingCard />
              </React.Fragment>
            ))}

          <Stack spacing="gap-y-4">
            {tags.length !== 0 &&
              tags.slice(0, 4).map((tag, index) => (
                <Stack
                  key={index}
                  direction="row"
                  align="center"
                  justify="between"
                  spacing="gap-y-2"
                >
                  <SubtitleTextIcon
                    label={tag.value}
                    subtitle={`${tag.totalPosts || 0} ${tagSubtitleLabel}`}
                    iconType="HashtagIcon"
                    backgroundColor={true}
                    onClick={() => onClickTopic(tag.value)}
                  />

                  <TrendingWidgetButton
                    inactiveLabel={subscribeLabel}
                    activeLabel={subscribedLabel}
                    activeHoverLabel={unsubscribeLabel}
                    active={subscribedTags?.includes(tag.value)}
                    activeIcon="CheckIcon"
                    activeHoverIcon="XMarkIcon"
                    onClickActive={() => handleUnsubscribeTopic(tag.value)}
                    onClickInactive={() => handleSubscribeTopic(tag.value)}
                    loading={!!isProcessingTags?.find(processingTag => processingTag === tag.value)}
                  />
                </Stack>
              ))}
          </Stack>
        </ul>
      </Stack>
    </Card>
  );
};

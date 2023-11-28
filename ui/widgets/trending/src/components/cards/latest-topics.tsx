import React from 'react';

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
            {tags.length !== 0 &&
              tags.slice(0, 4).map((tag, index) => (
                <Stack
                  key={index}
                  direction="row"
                  align="center"
                  justify="between"
                  spacing="gap-x-3"
                  customStyle="w-(full xl:[19rem])"
                >
                  <SubtitleTextIcon
                    label={tag.value}
                    subtitle={`${tag.totalPosts || 0} ${tagSubtitleLabel}`}
                    icon={<HashtagIcon />}
                    backgroundColor={true}
                    onClick={() => onClickTopic(tag.value)}
                  />

                  <DuplexButton
                    inactiveLabel={subscribeLabel}
                    activeLabel={subscribedLabel}
                    activeHoverLabel={unsubscribeLabel}
                    active={subscribedTags?.includes(tag.value)}
                    iconDirection="left"
                    activeIcon={<CheckIcon />}
                    activeHoverIcon={<XMarkIcon />}
                    inactiveVariant="secondary"
                    loading={!!isProcessingTags?.find(processingTag => processingTag === tag.value)}
                    hoverColors={{
                      background: { light: 'transparent', dark: 'transparent' },
                      border: { light: 'errorLight', dark: 'errorDark' },
                      text: { light: 'errorLight', dark: 'errorDark' },
                      icon: { light: 'errorLight', dark: 'errorDark' },
                    }}
                    onClickActive={() => handleUnsubscribeTopic(tag.value)}
                    onClickInactive={() => handleSubscribeTopic(tag.value)}
                  />
                </Stack>
              ))}
          </Stack>
        </ul>
      </Stack>
    </Card>
  );
};

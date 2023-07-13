import React from 'react';

import { Interest } from '@akashaorg/typings/ui';

import BasicCardBox from '@akashaorg/design-system-core/lib/components/BasicCardBox';
import Box from '@akashaorg/design-system-core/lib/components/Box';
import DuplexButton from '@akashaorg/design-system-core/lib/components/DuplexButton';
import SubtitleTextIcon from '@akashaorg/design-system-core/lib/components/SubtitleTextIcon';
import TextLine from '@akashaorg/design-system-core/lib/components/TextLine';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import TrendingWidgetLoadingCard from '@akashaorg/design-system-components/lib/components/TrendingWidgetLoadingCard';

export type LatestTopicsProps = {
  // data
  tags: Interest[];
  subscribedTags?: string[];
  isLoadingTags?: boolean;
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
    noTagsLabel,
    subscribeLabel,
    subscribedLabel,
    unsubscribeLabel,
    subscribedTags,
  } = props;

  const baseItemStyles = 'flex justify-between items-center space-y-2';

  return (
    <BasicCardBox pad="p-4">
      <Box customStyle="mb-4">
        <Text variant="button-md" weight="bold">
          {titleLabel}
        </Text>
      </Box>

      <Box>
        <ul>
          {tags.length === 0 && !isLoadingTags && (
            <Box customStyle="flex justify-center items-center">
              <Text>{noTagsLabel}</Text>
            </Box>
          )}

          {tags.length === 0 &&
            isLoadingTags &&
            Array.from({ length: 4 }, (_el, index: number) => (
              <React.Fragment key={index}>
                <TrendingWidgetLoadingCard />
              </React.Fragment>
            ))}

          <Box customStyle="space-y-4">
            {tags.length !== 0 &&
              tags.slice(0, 4).map((tag, index) => (
                <Box key={index} customStyle={baseItemStyles}>
                  <SubtitleTextIcon
                    label={tag.value}
                    subtitle={`${tag.totalPosts || 0} ${tagSubtitleLabel}`}
                    iconType="HashtagIcon"
                    backgroundColor={true}
                    onClick={() => onClickTopic(tag.value)}
                  />

                  <DuplexButton
                    inactiveLabel={subscribeLabel}
                    activeLabel={subscribedLabel}
                    activeHoverLabel={unsubscribeLabel}
                    onClickInactive={() => handleSubscribeTopic(tag.value)}
                    onClickActive={() => handleUnsubscribeTopic(tag.value)}
                    active={subscribedTags?.includes(tag.value)}
                    allowMinimization={false}
                  />
                </Box>
              ))}
          </Box>
        </ul>
      </Box>
    </BasicCardBox>
  );
};

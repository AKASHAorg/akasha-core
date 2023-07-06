import React from 'react';

import { Interest } from '@akashaorg/typings/ui';

import BasicCardBox from '@akashaorg/design-system-core/lib/components/BasicCardBox';
import Box from '@akashaorg/design-system-core/lib/components/Box';
import DuplexButton from '@akashaorg/design-system-core/lib/components/DuplexButton';
import SubtitleTextIcon from '@akashaorg/design-system-core/lib/components/SubtitleTextIcon';
import TextLine from '@akashaorg/design-system-core/lib/components/TextLine';
import Text from '@akashaorg/design-system-core/lib/components/Text';

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

  const baseTabPanelStyles = 'ring(white opacity-60 offset(2 blue-400)) focus:outline-none';

  const baseItemStyles = 'flex justify-between items-center space-y-2';

  return (
    <BasicCardBox pad="p-4">
      <Box customStyle="mb-4">
        <Text variant="button-md" weight="bold">
          {titleLabel}
        </Text>
      </Box>

      <Box customStyle={baseTabPanelStyles}>
        <ul>
          {tags.length === 0 && !isLoadingTags && (
            <Box customStyle="flex justify-center items-center">
              <Text>{noTagsLabel}</Text>
            </Box>
          )}

          {tags.length === 0 &&
            isLoadingTags &&
            Array.from({ length: 4 }, (_el, index: number) => (
              <Box key={index} customStyle={baseItemStyles}>
                <Box>
                  <TextLine title="tagName" animated={false} width="140px" />
                  <TextLine title="tagName" animated={false} width="80px" />
                </Box>

                <TextLine title="tagName" animated={false} width="7rem" height="2rem" />
              </Box>
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

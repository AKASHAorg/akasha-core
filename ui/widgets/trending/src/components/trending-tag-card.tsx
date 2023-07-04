import React from 'react';
import { ITag } from '@akashaorg/typings/ui';
import BasicCardBox from '@akashaorg/design-system-core/lib/components/BasicCardBox';
import TextLine from '@akashaorg/design-system-core/lib/components/TextLine';
import DuplexButton from '@akashaorg/design-system-core/lib/components/DuplexButton';
import SubtitleTextIcon from '@akashaorg/design-system-core/lib/components/SubtitleTextIcon';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import { tw, apply } from '@twind/core';
import Box from '@akashaorg/design-system-core/lib/components/Box';

export interface ITrendingTagCardProps {
  // data
  tags: ITag[];
  subscribedTags?: string[];
  isLoadingTags?: boolean;
  // labels
  noTagsLabel?: string;
  titleLabel: string;
  subscribeLabel?: string;
  unsubscribeLabel?: string;
  // anchor link
  tagAnchorLink: string;
  // handlers
  onClickTag: (tagName: string) => void;
  handleSubscribeTag: (tagName: string) => void;
  handleUnsubscribeTag: (tagName: string) => void;
  // css
  className?: string;
}

const BaseTabPanelStyles = apply`
    ring(white opacity-60  offset(2 blue-400)) focus:outline-none px-4
    `;

const BaseItemStyles = apply`
    flex justify-between items-center py-2
    `;

const TrendingTagCard: React.FC<ITrendingTagCardProps> = props => {
  const {
    onClickTag,
    handleSubscribeTag,
    handleUnsubscribeTag,
    titleLabel,
    tags,
    isLoadingTags,
    noTagsLabel,
    subscribeLabel,
    unsubscribeLabel,
    tagAnchorLink,
    subscribedTags,
  } = props;

  return (
    <BasicCardBox pad="0">
      <Box customStyle="py-4 pl-4">
        <Text variant="button-md" weight="bold">
          {titleLabel}
        </Text>
      </Box>

      <Box customStyle={BaseTabPanelStyles}>
        <ul>
          {tags.length === 0 && !isLoadingTags && (
            <Box customStyle="flex justify-center items-center">
              <Text>{noTagsLabel}</Text>
            </Box>
          )}
          {tags.length === 0 &&
            isLoadingTags &&
            Array.from({ length: 3 }, (_el, index: number) => (
              <Box key={index} customStyle={BaseItemStyles}>
                <Box>
                  <TextLine title="tagName" animated={false} width="140px" />
                  <TextLine title="tagName" animated={false} width="80px" />
                </Box>
                <TextLine title="tagName" animated={false} width="7rem" height="2rem" />
              </Box>
            ))}
          {tags.length !== 0 &&
            tags.slice(0, 3).map((tag, index) => (
              <Box key={index} customStyle={BaseItemStyles}>
                <a
                  onClick={e => {
                    e.preventDefault();
                    return false;
                  }}
                  href={`${tagAnchorLink}/${tag.name}`}
                >
                  <SubtitleTextIcon
                    onClick={() => onClickTag(tag.name)}
                    label={tag.name}
                    subtitle={`${tag.totalPosts} Posts`}
                    iconType="HashtagIcon"
                    backgroundColor={true}
                  />
                </a>
                <Box>
                  <DuplexButton
                    inactiveLabel={subscribeLabel}
                    activeLabel={unsubscribeLabel}
                    onClickInactive={() => handleSubscribeTag(tag.name)}
                    onClickActive={() => handleUnsubscribeTag(tag.name)}
                    active={subscribedTags?.includes(tag.name)}
                    allowMinimization={false}
                  />
                </Box>
              </Box>
            ))}
        </ul>
      </Box>
    </BasicCardBox>
  );
};

TrendingTagCard.defaultProps = {
  titleLabel: 'Trending Topics',
  subscribeLabel: 'Subscribe',
  unsubscribeLabel: 'Unsubscribe',
  noTagsLabel: 'No tags found!',
};

export default TrendingTagCard;

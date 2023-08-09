import React from 'react';

import Avatar from '@akashaorg/design-system-core/lib/components/Avatar';
import BasicCardBox from '@akashaorg/design-system-core/lib/components/BasicCardBox';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';
import StackedAvatar from '@akashaorg/design-system-core/lib/components/StackedAvatar';
import Box from '@akashaorg/design-system-core/lib/components/Box';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import Image from '@akashaorg/design-system-core/lib/components/Image';

import { IArticlesMiniCardProps } from '../components/articles-mini-card';
import { userData } from './dummy-data';

export interface IArticleCardProps extends IArticlesMiniCardProps {
  tagsLabel: string;
  collaboratorsLabel: string;
}

const ArticleCard: React.FC<IArticleCardProps> = props => {
  const {
    articleData,
    tagsLabel,
    readTimeLabel,
    copyrightLabel,
    collaboratorsLabel,
    mentionsLabel,
    repliesLabel,
    isSaved,
    saveLabel,
    savedLabel,
    toggleMenuDrop,
    closeMenuDrop,
    onTagClick,
    onMentionsClick,
    onRepliesClick,
    onSaveClick,
  } = props;

  return (
    <BasicCardBox customStyle="mb-2">
      <Box customStyle="p-4">
        <Box customStyle="flex flex-row justify-between">
          <Box customStyle="gap-1">
            <Box customStyle="flex flex-row gap-0.5 items-center">
              <Avatar
                avatar={articleData.authorAvatar}
                profileId={articleData.authorProfileId}
                size="xs"
              />
              <Text variant="h5">{articleData.authorName}</Text>
            </Box>
            <Box customStyle="flex flex-row gap-0.5">
              <Text variant="subtitle1">{articleData.publishDate}</Text>
              <Text variant="subtitle1">{`· ${articleData.readTime} ${readTimeLabel}`}</Text>
              {articleData.isCopyrighted && (
                <Text variant="subtitle1">{`· ${copyrightLabel}`}</Text>
              )}
            </Box>
          </Box>
          <Box customStyle="flex flex-row gap-2">
            <Icon type="akasha" />
            <button onClick={toggleMenuDrop}>
              <Icon type="EllipsisVerticalIcon" />
            </button>
          </Box>
        </Box>
      </Box>
      <Box customStyle="px-4 pb-4 border(b grey8 dark:grey3 gap-2)">
        <Text variant="h2">{articleData.title}</Text>
        <Box customStyle="h-[12.625rem] w-full rounded-sm">
          <Image customStyle="object-contain rounded-sm" src={articleData.image} />
        </Box>
        {articleData.content.map((el, idx) => (
          <Text key={idx} variant="h6" customStyle="mt-2">
            {el.value}
          </Text>
        ))}
      </Box>
      <Box customStyle="p-4 border(b grey8 dark:grey3) gap-4">
        <Box customStyle="flex gap-2">
          <Text variant="h2" customStyle="uppercase">
            {tagsLabel}
          </Text>
          <Box customStyle="flex flex-row flex-wrap gap-1">
            {articleData.topics.map((topic, idx) => (
              <button key={idx} onClick={() => onTagClick(topic)}>
                <Box customStyle="flex flex-row rounded-lg gap-0.5 mb-2 px-1 py-0.5 border(secondaryLight dark:secondaryDark) ">
                  <Text color={{ light: 'secondaryLight', dark: 'secondaryDark' }}>{topic}</Text>
                </Box>
              </button>
            ))}
          </Box>
        </Box>
        <Box customStyle="flex gap-1">
          <Text variant="h2" customStyle="uppercase">
            {collaboratorsLabel}
          </Text>
          <StackedAvatar size="md" userData={userData} maxAvatars={4} />
        </Box>
      </Box>
      <Box customStyle="flex flex-row justify-between items-center">
        <button onClick={onMentionsClick}>
          <Box customStyle="flex flex-row gap-1">
            <Icon type="AtSymbolIcon" />
            <Text variant="h6">{articleData.mentions}</Text>
            <Text variant="h6">{mentionsLabel}</Text>
          </Box>
        </button>
        <button onClick={onRepliesClick}>
          <Box customStyle="flex flex-row gap-1">
            <Icon type="ArrowPathIcon" />
            <Text variant="h6">{articleData.replies}</Text>
            <Text variant="h6">{repliesLabel}</Text>
          </Box>
        </button>
        <button onClick={onSaveClick}>
          <Box customStyle="flex flex-row gap-1" onClick={onSaveClick}>
            <Icon type="BookmarkIcon" />
            <Text variant="h6">{isSaved ? savedLabel : saveLabel}</Text>
          </Box>
        </button>
      </Box>
    </BasicCardBox>
  );
};
export default ArticleCard;

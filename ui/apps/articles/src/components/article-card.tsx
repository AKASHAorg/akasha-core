import React from 'react';

import Avatar from '@akashaorg/design-system-core/lib/components/Avatar';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';
import {
  ArrowPathIcon,
  AtSymbolIcon,
  BookmarkIcon,
  EllipsisVerticalIcon,
} from '@akashaorg/design-system-core/lib/components/Icon/hero-icons-outline';
import { Akasha } from '@akashaorg/design-system-core/lib/components/Icon/akasha-icons';
import StackedAvatar from '@akashaorg/design-system-core/lib/components/StackedAvatar';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
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
    // closeMenuDrop,
    onTagClick,
    onMentionsClick,
    onRepliesClick,
    onSaveClick,
  } = props;

  return (
    <Card customStyle="mb-2">
      <Stack padding="p-4">
        <Stack direction="row" justify="between">
          <Stack spacing="gap-1">
            <Stack direction="row" spacing="gap-0.5" align="center">
              <Avatar
                avatar={articleData.authorAvatar}
                profileId={articleData.authorProfileId}
                size="xs"
              />
              <Text variant="h5">{articleData.authorName}</Text>
            </Stack>
            <Stack direction="row" spacing="gap-0.5">
              <Text variant="subtitle1">{articleData.publishDate}</Text>
              <Text variant="subtitle1">{`· ${articleData.readTime} ${readTimeLabel}`}</Text>
              {articleData.isCopyrighted && (
                <Text variant="subtitle1">{`· ${copyrightLabel}`}</Text>
              )}
            </Stack>
          </Stack>
          <Stack direction="row" spacing="gap-2">
            <Icon icon={<Akasha />} solid={true} />
            <button onClick={toggleMenuDrop}>
              <Icon icon={<EllipsisVerticalIcon />} />
            </button>
          </Stack>
        </Stack>
      </Stack>
      <Stack padding="px-4 pb-4" customStyle="border(b grey8 dark:grey3 gap-2)">
        <Text variant="h2">{articleData.title}</Text>
        <Stack fullWidth={true} customStyle="h-[12.625rem] rounded-sm">
          <Image customStyle="object-contain rounded-sm" src={articleData.image} />
        </Stack>
        {articleData.content.map((el, idx) => (
          <Text key={idx} variant="h6" customStyle="mt-2">
            {el.value}
          </Text>
        ))}
      </Stack>
      <Stack spacing="gap-4" customStyle="p-4 border(b grey8 dark:grey3)">
        <Stack spacing="gap-2">
          <Text variant="h2" customStyle="uppercase">
            {tagsLabel}
          </Text>
          <Stack direction="row" spacing="gap-1" customStyle="flex-wrap">
            {articleData.topics.map((topic, idx) => (
              <button key={idx} onClick={() => onTagClick(topic)}>
                <Stack
                  direction="row"
                  spacing="gap-0.5"
                  customStyle="rounded-lg mb-2 px-1 py-0.5 border(secondaryLight dark:secondaryDark) "
                >
                  <Text color={{ light: 'secondaryLight', dark: 'secondaryDark' }}>{topic}</Text>
                </Stack>
              </button>
            ))}
          </Stack>
        </Stack>
        <Stack spacing="gap-1">
          <Text variant="h2" customStyle="uppercase">
            {collaboratorsLabel}
          </Text>
          <StackedAvatar size="md" userData={userData} maxAvatars={4} />
        </Stack>
      </Stack>
      <Stack direction="row" align="center" justify="between">
        <button onClick={onMentionsClick}>
          <Stack direction="row" spacing="gap-1">
            <Icon icon={<AtSymbolIcon />} />
            <Text variant="h6">{articleData.mentions}</Text>
            <Text variant="h6">{mentionsLabel}</Text>
          </Stack>
        </button>
        <button onClick={onRepliesClick}>
          <Stack direction="row" spacing="gap-1">
            <Icon icon={<ArrowPathIcon />} />
            <Text variant="h6">{articleData.replies}</Text>
            <Text variant="h6">{repliesLabel}</Text>
          </Stack>
        </button>
        <button onClick={onSaveClick}>
          <Stack direction="row" spacing="gap-1">
            <Icon icon={<BookmarkIcon />} />
            <Text variant="h6">{isSaved ? savedLabel : saveLabel}</Text>
          </Stack>
        </button>
      </Stack>
    </Card>
  );
};
export default ArticleCard;

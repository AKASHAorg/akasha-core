import React from 'react';

import { IArticleData } from '@akashaorg/typings/ui';

import Avatar from '@akashaorg/design-system-core/lib/components/Avatar';
import BasicCardBox from '@akashaorg/design-system-core/lib/components/BasicCardBox';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';
import Box from '@akashaorg/design-system-core/lib/components/Box';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import StackedAvatar from '@akashaorg/design-system-core/lib/components/StackedAvatar';
import Image from '@akashaorg/design-system-core/lib/components/Image';

export interface IArticlesMiniCardProps {
  articleData: IArticleData;
  activeTabIndex?: number;
  readTimeLabel?: string;
  copyrightLabel?: string;
  lastUpdatedLabel?: string;
  draftLabel?: string;
  collaboratingLabel?: string;
  mentionsLabel?: string;
  repliesLabel?: string;
  isSaved?: boolean;
  saveLabel?: string;
  savedLabel?: string;
  onClickArticle?: (id: string) => void;
  toggleMenuDrop?: (ev: React.SyntheticEvent, id?: string) => void;
  closeMenuDrop?: () => void;
  onTagClick?: (name: string) => void;
  onMentionsClick?: () => void;
  onRepliesClick?: () => void;
  onSaveClick?: () => void;
}

const ArticlesMiniCard: React.FC<IArticlesMiniCardProps> = props => {
  const {
    articleData,
    activeTabIndex,
    readTimeLabel,
    copyrightLabel,
    lastUpdatedLabel,
    draftLabel,
    collaboratingLabel,
    mentionsLabel,
    repliesLabel,
    isSaved,
    saveLabel,
    savedLabel,
    onClickArticle,
    toggleMenuDrop,
    closeMenuDrop,
    onTagClick,
    onMentionsClick,
    onRepliesClick,
    onSaveClick,
  } = props;

  // @TODO replace with real data when available
  const loggedProfileId = '0x003410490050000320006570034567114572000';

  const isCollaborator = articleData.collaborators?.find(el => el.did?.id === loggedProfileId);

  return (
    <BasicCardBox customStyle="p-4 gap-4">
      <Box customStyle="flex flex-row justify-between">
        <Box customStyle="flex flex-row gap-0.5 items-center">
          <Avatar
            avatar={articleData.authorAvatar}
            profileId={articleData.authorProfileId}
            size="xs"
          />
          <Text variant="h5">{articleData.authorName}</Text>
          {articleData.isPublished && (
            <>
              <Text variant="subtitle2">{articleData.publishDate}</Text>
              <Text variant="subtitle2">{`· ${articleData.readTime} ${readTimeLabel}`}</Text>
              {articleData.isCopyrighted && (
                <Text variant="subtitle2">{`· ${copyrightLabel}`}</Text>
              )}
            </>
          )}
          {articleData.isDraft && (
            <Text variant="subtitle2">{`· ${lastUpdatedLabel} ${articleData.lastUpdateDate}`}</Text>
          )}
        </Box>
        <Box customStyle="flex-flex-row gap-2 items-center">
          {articleData.isDraft && (
            <Box customStyle="rounded-lg px-1 py-px bg(grey4 dark:grey7)">
              <Text color="white">{draftLabel}</Text>
            </Box>
          )}
          <Icon type="akasha" />
          <button onClick={ev => toggleMenuDrop(ev, articleData.id)}>
            <Icon type="EllipsisVerticalIcon" />
          </button>
        </Box>
      </Box>
      <button onClick={() => onClickArticle(articleData.id)}>
        <Box customStyle="flex flex-row justify-between items-center">
          <Box customStyle="gap-2">
            <Text variant="h2">{articleData.title}</Text>
            <Text variant="h6">{articleData.subtitle}</Text>
          </Box>
          <Box>
            <Box customStyle="h-[5.1875rem] w-[17.25rem] self-center">
              <Image customStyle="object-contain" src={articleData.image} />
            </Box>
          </Box>
        </Box>
      </button>
      {articleData.isPublished && (
        <>
          <Box customStyle="flex flex-row flex-wrap gap-1">
            {articleData.topics.map((tag, idx) => (
              <button key={idx} onClick={() => onTagClick(tag)}>
                <Box customStyle="flex flex-row rounded-lg gap-0.5 mb-2 px-1 py-0.5 border(secondaryLight dark:secondaryDark)">
                  <Text color="accentText">{tag}</Text>
                </Box>
              </button>
            ))}
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
                <Icon type="bookmark" />
                <Text variant="h6">{isSaved ? savedLabel : saveLabel}</Text>
              </Box>
            </button>
          </Box>
        </>
      )}
      {activeTabIndex === 1 && articleData.collaborators?.length > 0 && (
        <Box customStyle="flex flex-row gap-2 items-center">
          <StackedAvatar size="md" userData={articleData.collaborators} maxAvatars={4} />
          <Text variant="subtitle2">{collaboratingLabel}</Text>
        </Box>
      )}
      {activeTabIndex === 2 && isCollaborator && (
        <Box customStyle="flex flex-row gap-2 items-center">
          <Avatar size="md" profileId={loggedProfileId} />
          <Text variant="subtitle2">{collaboratingLabel}</Text>
        </Box>
      )}
    </BasicCardBox>
  );
};

export default ArticlesMiniCard;

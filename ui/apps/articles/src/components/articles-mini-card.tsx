import React from 'react';
import Avatar from '@akashaorg/design-system-core/lib/components/Avatar';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import StackedAvatar from '@akashaorg/design-system-core/lib/components/StackedAvatar';
import Image from '@akashaorg/design-system-core/lib/components/Image';
import { IArticleData } from '@akashaorg/typings/lib/ui';
import {
  ArrowPathIcon,
  AtSymbolIcon,
  BookmarkIcon,
  EllipsisVerticalIcon,
} from '@akashaorg/design-system-core/lib/components/Icon/hero-icons-outline';
import { Akasha } from '@akashaorg/design-system-core/lib/components/Icon/akasha-icons';
import { transformSource } from '@akashaorg/ui-awf-hooks';

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
    // closeMenuDrop,
    onTagClick,
    onMentionsClick,
    onRepliesClick,
    onSaveClick,
  } = props;

  // @TODO replace with real data when available
  const loggedProfileId = '0x003410490050000320006570034567114572000';

  const isCollaborator = articleData.collaborators?.find(el => el.did?.id === loggedProfileId);

  return (
    <Card customStyle="p-4 gap-4">
      <Stack direction="row" justify="between">
        <Stack direction="row" spacing="gap-0.5" align="center">
          <Avatar
            avatar={transformSource(articleData?.authorAvatar?.default)}
            alternativeAvatars={articleData?.authorAvatar?.alternatives?.map(alternative =>
              transformSource(alternative),
            )}
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
        </Stack>
        <Stack direction="row" spacing="gap-2" align="center">
          {articleData.isDraft && (
            <Stack customStyle="rounded-lg px-1 py-px bg(grey4 dark:grey7)">
              <Text color="white">{draftLabel}</Text>
            </Stack>
          )}
          <Icon icon={<Akasha />} solid={true} />
          <button onClick={ev => toggleMenuDrop(ev, articleData.id)}>
            <Icon icon={<EllipsisVerticalIcon />} />
          </button>
        </Stack>
      </Stack>
      <button onClick={() => onClickArticle(articleData.id)}>
        <Stack
          direction="row"
          align="center"
          justify="between"
          customStyle="flex flex-row justify-between items-center"
        >
          <Stack spacing="gap-2">
            <Text variant="h2">{articleData.title}</Text>
            <Text variant="h6">{articleData.subtitle}</Text>
          </Stack>
          <Stack>
            <Stack customStyle="h-[5.1875rem] w-[17.25rem] self-center">
              <Image customStyle="object-contain" src={articleData.image} />
            </Stack>
          </Stack>
        </Stack>
      </button>
      {articleData.isPublished && (
        <>
          <Stack direction="row" spacing="gap-1" customStyle="flex-wrap">
            {articleData.topics.map((tag, idx) => (
              <button key={idx} onClick={() => onTagClick(tag)}>
                <Stack customStyle="flex flex-row rounded-lg gap-0.5 mb-2 px-1 py-0.5 border(secondaryLight dark:secondaryDark)">
                  <Text color={{ light: 'secondaryLight', dark: 'secondaryDark' }}>{tag}</Text>
                </Stack>
              </button>
            ))}
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
        </>
      )}
      {activeTabIndex === 1 && articleData.collaborators?.length > 0 && (
        <Stack direction="row" spacing="gap-2" align="center">
          <StackedAvatar
            size="md"
            userData={articleData.collaborators.map(collaborator => ({
              ...collaborator,
              avatar: collaborator.avatar?.default,
              alternativeAvatars: collaborator.avatar?.alternatives,
            }))}
            maxAvatars={4}
          />
          <Text variant="subtitle2">{collaboratingLabel}</Text>
        </Stack>
      )}
      {activeTabIndex === 2 && isCollaborator && (
        <Stack direction="row" spacing="gap-2" align="center">
          <Avatar size="md" profileId={loggedProfileId} />
          <Text variant="subtitle2">{collaboratingLabel}</Text>
        </Stack>
      )}
    </Card>
  );
};

export default ArticlesMiniCard;

import * as React from 'react';
import DS from '@akashaproject/design-system';
import type { TFunction } from 'i18next';
import type { ILocale } from '@akashaproject/design-system/lib/utils/time';

const { EntryBox, Box, EditorPlaceholder, CommentEditor } = DS;

export interface IGetCustomEntitiesProps {
  isBookmarked?: boolean;
  feedItems: string[];
  loggedEthAddress: string | null;
  t: TFunction;
  locale: ILocale;
  onAvatarClick: any;
  onContentClick?: any;
  entryData: any;
  onEntryBookmark: any;
  showLoginModal: any;
  handleEntryShare: any;
  handleEntryFlag: any;
  handleClickReplies: any;
  handleFollow: any;
  handleUnfollow: any;
  handleNavigateToPost: any;
  handlePublish: any;
  handleGetMentions: any;
  handleGetTags: any;
  tags: any;
  mentions: any;
  onUploadRequest: any;
}

export const getPostPageCustomEntities = (props: IGetCustomEntitiesProps) => {
  const {
    isBookmarked,
    feedItems,
    loggedEthAddress,
    onAvatarClick,
    entryData,
    t,
    locale,
    onEntryBookmark,
    showLoginModal,
    handleEntryShare,
    handleEntryFlag,
    handleClickReplies,
    handleFollow,
    handleUnfollow,
    handleNavigateToPost,
    handlePublish,
    handleGetMentions,
    handleGetTags,
    tags,
    mentions,
    onUploadRequest,
  } = props;

  const customEntities = [];

  customEntities.push({
    position: 'before',
    // itemIndex: 0,
    itemId: feedItems.length ? feedItems[0] : null,
    getComponent: ({ key, style }: { key: string; style: any }) => (
      <>
        <Box
          margin={{ horizontal: 'medium' }}
          pad={{ bottom: 'small' }}
          border={{ side: 'bottom', size: '1px', color: 'border' }}
          key={key}
          style={style}
        >
          <EntryBox
            isBookmarked={isBookmarked}
            entryData={entryData}
            sharePostLabel={t('Share Post')}
            shareTextLabel={t('Share this post with your friends')}
            sharePostUrl={'https://ethereum.world'}
            onClickAvatar={onAvatarClick}
            onEntryBookmark={onEntryBookmark}
            repliesLabel={t('Replies')}
            repostsLabel={t('Reposts')}
            repostLabel={t('Repost')}
            repostWithCommentLabel={t('Repost with comment')}
            shareLabel={t('Share')}
            copyLinkLabel={t('Copy Link')}
            copyIPFSLinkLabel={t('Copy IPFS Link')}
            flagAsLabel={t('Report Post')}
            loggedProfileEthAddress={'0x00123123123123'}
            locale={locale}
            bookmarkLabel={t('Save')}
            bookmarkedLabel={t('Saved')}
            onRepost={() => {
              return;
            }}
            onEntryShare={handleEntryShare}
            onEntryFlag={handleEntryFlag(entryData.entryId, loggedEthAddress)}
            onClickReplies={handleClickReplies}
            handleFollow={handleFollow}
            handleUnfollow={handleUnfollow}
            onContentClick={handleNavigateToPost}
          />
        </Box>
        {!loggedEthAddress && (
          <Box margin="medium">
            <EditorPlaceholder onClick={showLoginModal} />
          </Box>
        )}
        {loggedEthAddress && (
          <Box margin="medium">
            <CommentEditor
              ethAddress={loggedEthAddress}
              postLabel={t('Publish')}
              placeholderLabel={t('Write something')}
              onPublish={handlePublish}
              getMentions={handleGetMentions}
              getTags={handleGetTags}
              tags={tags}
              mentions={mentions}
              uploadRequest={onUploadRequest}
            />
          </Box>
        )}
      </>
    ),
  });

  if (customEntities.length) {
    return customEntities;
  }
  return;
};

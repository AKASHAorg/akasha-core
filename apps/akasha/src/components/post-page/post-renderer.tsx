import * as React from 'react';
import DS from '@akashaproject/design-system';
import { useTranslation } from 'react-i18next';
import { useFollow } from '@akashaproject/ui-awf-hooks';
import { IAkashaError } from '@akashaproject/ui-awf-typings';
import routes, { POST } from '../../routes';
import { useComment, useEditComment } from '@akashaproject/ui-awf-hooks/lib/use-comments.new';
import { mapEntry } from '@akashaproject/ui-awf-hooks/lib/utils/entry-utils';

const {
  ErrorLoader,
  EntryCardHidden,
  EntryBox,
  Box,
  EntryCardLoading,
  TextIcon,
  StyledSelectBox,
  CommentEditor,
} = DS;

export interface PostRendererProps {
  logger: any;
  itemId?: string;
  itemData?: any;
  locale: any;
  ethAddress: string | null;
  onBookmark: (entryId: string) => void;
  onNavigate: (details: any) => void;
  onLinkCopy?: () => void;
  onFlag: (entryId: string, contentType: string) => () => void;
  onRepost: (withComment: boolean, entryData: any) => void;
  sharePostUrl: string;
  onAvatarClick: (ev: React.MouseEvent<HTMLDivElement>, authorEth: string) => void;
  onMentionClick: (pubKey: string) => void;
  onTagClick: (name: string) => void;
  singleSpaNavigate: (url: string) => void;
  bookmarkState?: any;
  style?: React.CSSProperties;
  contentClickable?: boolean;
  disableActions?: boolean;
  hidePublishTime?: boolean;
  headerTextLabel?: string;
  footerTextLabel?: string;
  moderatedContentLabel?: string;
  ctaLabel?: string;
  onEntryRemove?: (entryId: string) => void;
  removeEntryLabel?: string;
  removedByMeLabel?: string;
  removedByAuthorLabel?: string;
  loggedProfileData?: any;
}

const PostRenderer = (props: PostRendererProps) => {
  const {
    style,
    ethAddress,
    logger,
    contentClickable,
    bookmarkState,
    hidePublishTime,
    headerTextLabel,
    footerTextLabel,
    moderatedContentLabel,
    ctaLabel,
    disableActions,
    sharePostUrl,
  } = props;

  const [showAnyway, setShowAnyway] = React.useState<boolean>(false);

  const { t } = useTranslation();
  const [isEditing, setIsEditing] = React.useState(false);
  const [followedProfiles, followActions] = useFollow({
    onError: (errorInfo: IAkashaError) => {
      logger.error(errorInfo.error.message, errorInfo.errorKey);
    },
  });
  const commentReq = useComment(props.itemId);
  const itemData = React.useMemo(() => {
    if (commentReq.data) {
      if (commentReq.data.isPublishing) {
        return {
          ...mapEntry(commentReq.data),
          content: commentReq.data.content,
        };
      }
      return mapEntry(commentReq.data);
    }
    return undefined;
  }, [commentReq.data]);

  const isReported = React.useMemo(() => {
    if (showAnyway) {
      return false;
    }
    return commentReq.status === 'success' && itemData?.reported;
  }, [itemData, showAnyway, commentReq.status]);

  const isFollowing = React.useMemo(() => {
    if (itemData?.author.ethAddress) {
      return followedProfiles.includes(itemData.author.ethAddress);
    }
    // defaults to false
    return false;
  }, [followedProfiles, itemData]);

  const editReq = useEditComment(itemData?.entryId);
  const isBookmarked = React.useMemo(() => {
    if (
      bookmarkState &&
      !bookmarkState.isFetching &&
      itemData?.entryId &&
      bookmarkState.data?.findIndex(bm => bm.entryId === itemData?.entryId) >= 0
    ) {
      return true;
    }
    return false;
  }, [bookmarkState.data]);

  React.useEffect(() => {
    if (ethAddress && itemData?.author.ethAddress) {
      followActions.isFollowing(ethAddress, itemData.author.ethAddress);
    }
  }, [ethAddress, itemData?.author.ethAddress]);

  const handleFollow = () => {
    if (itemData?.author.ethAddress) {
      followActions.follow(itemData.author.ethAddress);
    }
  };

  const handleUnfollow = () => {
    if (itemData?.author.ethAddress) {
      followActions.unfollow(itemData.author.ethAddress);
    }
  };
  // when the edit button is clicked, show the editor
  const handleEditClick = () => {
    setIsEditing(true);
  };

  // when cancel is clicked, set isEditing the state back to false
  const handleCancelClick = () => {
    setIsEditing(false);
  };

  const handleEditComment = (commentData: any) => {
    // save edited comment;
    editReq.mutate({ ...commentData, postID: itemData?.postId });
    setIsEditing(false);
  };

  const handleFlipCard = () => {
    setShowAnyway(true);
  };

  return (
    <>
      {commentReq.status === 'loading' && <EntryCardLoading />}
      {commentReq.status === 'error' && (
        <ErrorLoader
          type="script-error"
          title={t('There was an error loading the entry')}
          details={t('We cannot show this entry right now')}
          devDetails={commentReq.error}
        />
      )}
      {commentReq.status === 'success' && (
        <>
          {itemData.moderated && itemData.delisted && (
            <EntryCardHidden moderatedContentLabel={moderatedContentLabel} isDelisted={true} />
          )}
          {!itemData.moderated && isReported && (
            <EntryCardHidden
              reason={itemData.reason}
              headerTextLabel={headerTextLabel}
              footerTextLabel={footerTextLabel}
              ctaLabel={ctaLabel}
              handleFlipCard={handleFlipCard}
            />
          )}
          {!itemData.moderated && !isReported && (
            <Box
              pad={{ horizontal: 'medium' }}
              border={{ side: 'bottom', size: '1px', color: 'border' }}
              style={style}
            >
              {isEditing && (
                <Box margin="medium">
                  <CommentEditor
                    avatar={itemData.author.avatar}
                    ethAddress={ethAddress}
                    postLabel={t('Save')}
                    emojiPlaceholderLabel={t('Search')}
                    onPublish={handleEditComment}
                    getMentions={() => {
                      /*  */
                    }}
                    getTags={() => {
                      /*  */
                    }}
                    tags={[]}
                    mentions={[]}
                    uploadRequest={() => {
                      /*  */
                    }}
                    editorState={itemData.content}
                    isShown={true}
                    showCancelButton={true}
                    onCancelClick={handleCancelClick}
                    cancelButtonLabel={t('Cancel')}
                  />
                </Box>
              )}
              {!isEditing && itemData && (
                <EntryBox
                  style={itemData.isPublishing ? { backgroundColor: '#4e71ff0f' } : {}}
                  isBookmarked={isBookmarked}
                  isRemoved={
                    itemData.content.length === 1 && itemData.content[0].property === 'removed'
                  }
                  entryData={itemData}
                  sharePostLabel={t('Share Post')}
                  shareTextLabel={t('Share this post with your friends')}
                  sharePostUrl={sharePostUrl}
                  onClickAvatar={(ev: React.MouseEvent<HTMLDivElement>) =>
                    props.onAvatarClick(ev, itemData.author.pubKey)
                  }
                  onEntryBookmark={props.onBookmark}
                  repliesLabel={t('Replies')}
                  repostsLabel={t('Reposts')}
                  repostLabel={t('Repost')}
                  repostWithCommentLabel={t('Repost with comment')}
                  shareLabel={t('Share')}
                  copyLinkLabel={t('Copy Link')}
                  flagAsLabel={t('Report Comment')}
                  loggedProfileEthAddress={ethAddress}
                  locale={props.locale}
                  bookmarkLabel={t('Save')}
                  bookmarkedLabel={t('Saved')}
                  profileAnchorLink={'/profile'}
                  repliesAnchorLink={routes[POST]}
                  onRepost={props.onRepost}
                  onEntryFlag={props.onFlag(itemData.entryId, 'reply')}
                  handleFollowAuthor={handleFollow}
                  handleUnfollowAuthor={handleUnfollow}
                  isFollowingAuthor={isFollowing}
                  onContentClick={props.onNavigate}
                  contentClickable={contentClickable}
                  onMentionClick={props.onMentionClick}
                  onTagClick={props.onTagClick}
                  singleSpaNavigate={props.singleSpaNavigate}
                  hidePublishTime={hidePublishTime}
                  disableActions={disableActions}
                  hideActionButtons={true}
                  onEntryRemove={props.onEntryRemove}
                  removeEntryLabel={props.removeEntryLabel}
                  removedByMeLabel={props.removedByMeLabel}
                  removedByAuthorLabel={props.removedByAuthorLabel}
                  headerMenuExt={
                    props.ethAddress === itemData.author.ethAddress && (
                      <StyledSelectBox onClick={handleEditClick}>
                        <TextIcon label={t('Edit Reply')} iconType="edit" />
                      </StyledSelectBox>
                    )
                  }
                />
              )}
            </Box>
          )}
        </>
      )}
    </>
  );
};

export default PostRenderer;

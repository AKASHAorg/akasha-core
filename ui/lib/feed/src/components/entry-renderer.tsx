import * as React from 'react';
import DS from '@akashaproject/design-system';
import { ILocale } from '@akashaproject/design-system/lib/utils/time';
import { useTranslation } from 'react-i18next';
import { RootComponentProps } from '@akashaproject/ui-awf-typings';
import { EventTypes, ItemTypes } from '@akashaproject/ui-awf-typings/lib/app-loader';
import {
  usePost,
  useComment,
  useEditComment,
  mapEntry,
  useFollow,
  useIsFollowingMultiple,
  useUnfollow,
  getLinkPreview,
  uploadMediaToTextile,
  LoginState,
  useTagSearch,
  useMentionSearch,
} from '@akashaproject/ui-awf-hooks';
import { IContentClickDetails } from '@akashaproject/design-system/lib/components/EntryCard/entry-box';
import { TrackEventData } from '@akashaproject/ui-awf-typings/lib/analytics';

const {
  Box,
  CommentEditor,
  ErrorLoader,
  EntryCardLoading,
  EntryCard,
  EntryCardHidden,
  ExtensionPoint,
} = DS;

export interface IEntryRenderer {
  itemId?: string;
  sharePostUrl: string;
  loginState: LoginState;
  locale: ILocale;
  style?: React.CSSProperties;
  onFlag?: (entryId: string, itemType: string, reporterEthAddress?: string | null) => () => void;
  onRepost: (withComment: boolean, entryId: string) => void;
  onNavigate: (details: IContentClickDetails, itemType: ItemTypes) => void;
  singleSpaNavigate: (url: string) => void;
  contentClickable?: boolean;
  itemType: ItemTypes;
  onEntryRemove?: (entryId: string) => void;
  parentIsProfilePage?: boolean;
  removeEntryLabel?: string;
  removedByMeLabel?: string;
  removedByAuthorLabel?: string;
  uiEvents: RootComponentProps['uiEvents'];
  className?: string;
  modalSlotId: string;
  trackEvent?: (event: Omit<TrackEventData, 'eventType'>) => void;
}

const commentStyleExt = {
  padding: '0 1rem',
  boxShadow: 'none',
};

const EntryRenderer = (props: IEntryRenderer) => {
  const {
    loginState,
    locale,
    itemId,
    itemType,
    style,
    onFlag,
    onNavigate,
    singleSpaNavigate,
    sharePostUrl,
    onRepost,
    contentClickable,
    parentIsProfilePage,
    modalSlotId,
    trackEvent,
  } = props;

  const [showAnyway, setShowAnyway] = React.useState<boolean>(false);
  const followProfileQuery = useFollow();
  const unfollowProfileQuery = useUnfollow();
  const [isEditingComment, setIsEditingComment] = React.useState<boolean>(false);

  const [mentionQuery, setMentionQuery] = React.useState(null);
  const [tagQuery, setTagQuery] = React.useState(null);
  const mentionSearch = useMentionSearch(mentionQuery);
  const tagSearch = useTagSearch(tagQuery);

  const handleMentionQueryChange = (query: string) => {
    setMentionQuery(query);
  };

  const handleTagQueryChange = (query: string) => {
    setTagQuery(query);
  };

  const { t } = useTranslation('ui-lib-feed');

  const postReq = usePost({ postId: itemId, enabler: itemType === ItemTypes.ENTRY });
  const commentReq = useComment(itemId, itemType === ItemTypes.COMMENT);
  const authorEthAddress = React.useMemo(() => {
    if (itemType === ItemTypes.COMMENT && commentReq.status === 'success') {
      return commentReq.data.author.ethAddress;
    }
    if (itemType === ItemTypes.ENTRY && postReq.status === 'success') {
      return postReq.data.author.ethAddress;
    }
  }, [itemType, commentReq, postReq]);

  const followedProfilesReq = useIsFollowingMultiple(loginState.ethAddress, [authorEthAddress]);

  const postData = React.useMemo(() => {
    if (postReq.data && itemType === ItemTypes.ENTRY) {
      return mapEntry(postReq.data);
    }
    return undefined;
  }, [postReq.data, itemType]);

  const commentData = React.useMemo(() => {
    if (commentReq.data && itemType === ItemTypes.COMMENT) {
      return mapEntry(commentReq.data);
    }
    return undefined;
  }, [commentReq.data, itemType]);

  const isFollowing = React.useMemo(() => {
    return (
      followedProfilesReq.status === 'success' &&
      followedProfilesReq.data.includes(authorEthAddress)
    );
  }, [authorEthAddress, followedProfilesReq.data, followedProfilesReq.status]);

  const itemData = React.useMemo(() => {
    if (itemType === ItemTypes.ENTRY) {
      return postData;
    } else if (itemType === ItemTypes.COMMENT) {
      return commentData;
    }
  }, [postData, commentData, itemType]);

  const commentEditReq = useEditComment(itemData?.entryId, !!commentData);

  const [isReported, isAccountReported] = React.useMemo(() => {
    if (showAnyway) {
      return [false, false];
    }
    const reqSuccess = postReq.isSuccess || commentReq.isSuccess;
    return [reqSuccess && itemData?.reported, reqSuccess && itemData?.author?.reported];
  }, [itemData, showAnyway, postReq.isSuccess, commentReq.isSuccess]);

  const disablePublishing = React.useMemo(
    () => loginState.waitForAuth || !loginState.isReady,
    [loginState],
  );

  const handleFollow = React.useCallback(() => {
    if (authorEthAddress) {
      followProfileQuery.mutate(authorEthAddress);
    }
  }, [followProfileQuery, authorEthAddress]);

  const handleUnfollow = React.useCallback(() => {
    if (authorEthAddress) {
      unfollowProfileQuery.mutate(authorEthAddress);
    }
  }, [unfollowProfileQuery, authorEthAddress]);

  const handleEditClick = React.useCallback(() => {
    if (itemType === ItemTypes.COMMENT) {
      setIsEditingComment(true);
    }
  }, [itemType]);

  const handleAvatarClick = () => {
    onNavigate(
      {
        id: itemData?.author.pubKey,
        authorEthAddress: itemData?.author.ethAddress,
      },
      ItemTypes.PROFILE,
    );
  };

  const handleContentClick = (details: IContentClickDetails) => {
    onNavigate(details, itemType);
  };

  const handleMentionClick = (pubKey: string) => {
    onNavigate(
      {
        id: pubKey,
        authorEthAddress: pubKey,
      },
      ItemTypes.PROFILE,
    );
  };

  const handleTagClick = (name: string) => {
    onNavigate(
      {
        id: name,
        authorEthAddress: name,
      },
      ItemTypes.TAG,
    );
  };

  const handleExtensionMount = (name: string) => {
    props.uiEvents.next({
      event: EventTypes.ExtensionPointMount,
      data: {
        name,
        entryId: itemId,
        entryType: itemType,
      },
    });
  };

  const handleExtensionUnmount = (name: string) => {
    props.uiEvents.next({
      event: EventTypes.ExtensionPointUnmount,
      data: {
        name,
        entryId: itemId,
        entryType: itemType,
      },
    });
  };
  const handleFlipCard = () => {
    setShowAnyway(true);
  };

  const itemTypeName = React.useMemo(() => {
    switch (itemType) {
      case ItemTypes.ENTRY:
        return t('post');
      case ItemTypes.PROFILE:
        return t('account');
      case ItemTypes.COMMENT:
        return t('reply');
      case ItemTypes.TAG:
        return t('tag');
      default:
        return t('unknown');
    }
  }, [t, itemType]);

  const accountAwaitingModeration =
    !itemData?.author?.moderated && isAccountReported && !parentIsProfilePage;
  const entryAwaitingModeration = !itemData?.moderated && isReported;

  const reportedTypeName = React.useMemo(() => {
    if (accountAwaitingModeration) return `the author of this ${itemTypeName}`;
    return `this ${itemTypeName}`;
  }, [accountAwaitingModeration, itemTypeName]);

  const handleCancelClick = () => {
    setIsEditingComment(false);
  };

  const handleEditComment = commentData => {
    if (trackEvent) {
      trackEvent({
        category: 'Reply',
        action: 'Edit',
      });
    }
    commentEditReq.mutate({ ...commentData, postID: itemData.postId });
    setIsEditingComment(false);
  };

  const showEditButton = React.useMemo(
    () => loginState.isReady && loginState.ethAddress === itemData?.author?.ethAddress,
    [itemData?.author?.ethAddress, loginState.ethAddress, loginState.isReady],
  );

  const isComment = React.useMemo(() => itemType === ItemTypes.COMMENT, [itemType]);

  return (
    <>
      {(postReq.isLoading || commentReq.isLoading) && <EntryCardLoading />}
      {(postReq.isError || commentReq.isError) && (
        <ErrorLoader
          type="script-error"
          title={t('There was an error loading the {{itemTypeName}}', { itemTypeName })}
          details={t('We cannot show this {{itemTypeName}} now', { itemTypeName })}
          devDetails={postReq.error}
        />
      )}
      {(postReq.isSuccess || commentReq.isSuccess) && (
        <>
          {(accountAwaitingModeration || entryAwaitingModeration) && (
            <EntryCardHidden
              reason={entryAwaitingModeration ? itemData.reason : itemData.author?.reason}
              headerTextLabel={t('You reported {{reportedTypeName}} for the following reason', {
                reportedTypeName,
              })}
              footerTextLabel={t('It is awaiting moderation.')}
              ctaLabel={t('See it anyway')}
              handleFlipCard={handleFlipCard}
            />
          )}
          {isEditingComment && (
            <Box margin="medium">
              <CommentEditor
                avatar={itemData.author.avatar}
                ethAddress={itemData.author.ethAddress}
                postLabel={t('Save')}
                placeholderLabel={t('Reply to {{itemDataAuthorName}}', {
                  itemDataAuthorName: itemData.author.name || '',
                })}
                emojiPlaceholderLabel={t('Search')}
                disablePublishLabel={t('Authenticating')}
                disablePublish={disablePublishing}
                onPublish={handleEditComment}
                getLinkPreview={getLinkPreview}
                getMentions={handleMentionQueryChange}
                getTags={handleTagQueryChange}
                tags={tagSearch.data}
                mentions={mentionSearch.data}
                uploadRequest={uploadMediaToTextile}
                editorState={itemData.slateContent}
                isShown={true}
                showCancelButton={true}
                onCancelClick={handleCancelClick}
                cancelButtonLabel={t('Cancel')}
              />
            </Box>
          )}
          {!entryAwaitingModeration &&
            !accountAwaitingModeration &&
            !itemData.delisted &&
            !itemData.isRemoved && (
              <EntryCard
                className={props.className}
                isRemoved={itemData.isRemoved}
                entryData={itemData}
                sharePostUrl={sharePostUrl}
                sharePostLabel={t('Share Post')}
                shareTextLabel={t('Share this post with your friends')}
                onClickAvatar={handleAvatarClick}
                repliesLabel={t('Replies')}
                repostsLabel={t('Reposts')}
                repostLabel={t('Repost')}
                editedLabel={t('Last edited')}
                repostWithCommentLabel={t('Repost with comment')}
                shareLabel={t('Share')}
                copyLinkLabel={t('Copy Link')}
                flagAsLabel={t('Report {{itemTypeName}}', { itemTypeName })}
                loggedProfileEthAddress={loginState.isReady && loginState.ethAddress}
                locale={locale || 'en'}
                style={{
                  ...(style as React.CSSProperties),
                  ...(commentData && commentStyleExt),
                  display: isEditingComment ? 'none' : 'block',
                }}
                showMore={true}
                profileAnchorLink={'/profile'}
                repliesAnchorLink={'/social-app/post'}
                onRepost={onRepost}
                onEntryFlag={onFlag && onFlag(itemData.entryId, itemTypeName)}
                handleFollowAuthor={handleFollow}
                handleUnfollowAuthor={handleUnfollow}
                isFollowingAuthor={isFollowing}
                onContentClick={handleContentClick}
                onMentionClick={handleMentionClick}
                onTagClick={handleTagClick}
                singleSpaNavigate={singleSpaNavigate}
                contentClickable={contentClickable}
                moderatedContentLabel={t('This content has been moderated')}
                ctaLabel={t('See it anyway')}
                handleFlipCard={handleFlipCard}
                onEntryRemove={props.onEntryRemove}
                removeEntryLabel={props.removeEntryLabel}
                removedByMeLabel={props.removedByMeLabel}
                removedByAuthorLabel={props.removedByAuthorLabel}
                disableReposting={itemData.isRemoved}
                disableReporting={loginState.waitForAuth || loginState.isSigningIn}
                hideActionButtons={isComment}
                modalSlotId={modalSlotId}
                bottomBorderOnly={isComment}
                noBorderRadius={isComment}
                actionsRightExt={
                  <ExtensionPoint
                    name={`entry-card-actions-right_${itemId}`}
                    onMount={handleExtensionMount}
                    onUnmount={handleExtensionUnmount}
                  />
                }
                headerMenuExt={
                  showEditButton && (
                    <ExtensionPoint
                      style={{ width: '100%' }}
                      onClick={handleEditClick}
                      name={`entry-card-edit-button_${itemId}`}
                      onMount={handleExtensionMount}
                      onUnmount={handleExtensionUnmount}
                    />
                  )
                }
              />
            )}
        </>
      )}
    </>
  );
};

export default React.memo(EntryRenderer);

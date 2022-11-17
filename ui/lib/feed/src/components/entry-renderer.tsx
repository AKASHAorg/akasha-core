import * as React from 'react';
import DS, { BoxExtendedProps } from '@akashaorg/design-system';
import FeedWidget from './App';
import { ILocale } from '@akashaorg/design-system/lib/utils/time';
import { useTranslation } from 'react-i18next';
import {
  AnalyticsCategories,
  TrackEventData,
  EventTypes,
  EntityTypes,
  NavigateToParams,
  RootComponentProps,
  ModalNavigationOptions,
  IProfileData,
} from '@akashaorg/typings/ui';
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
} from '@akashaorg/ui-awf-hooks';
import { IContentClickDetails } from '@akashaorg/design-system/lib/components/EntryCard/entry-box';
import { useInfiniteReplies } from '@akashaorg/ui-awf-hooks/lib/use-comments';
import { ILogger } from '@akashaorg/typings/sdk/log';
import { i18n } from 'i18next';

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
  itemSpacing?: number;
  sharePostUrl: string;
  loginState: LoginState;
  locale: ILocale;
  style?: React.CSSProperties;
  onFlag?: (
    entryId: string,
    itemType: EntityTypes,
    reporterEthAddress?: string | null,
  ) => () => void;
  onRepost: (withComment: boolean, entryId: string) => void;
  onEntryNavigate: (details: IContentClickDetails, itemType: EntityTypes) => void;
  navigateTo: (args: NavigateToParams) => void;
  contentClickable?: boolean;
  itemType: EntityTypes;
  onEntryRemove?: (entryId: string) => void;
  parentIsProfilePage?: boolean;
  removeEntryLabel?: string;
  removedByMeLabel?: string;
  removedByAuthorLabel?: string;
  uiEvents: RootComponentProps['uiEvents'];
  className?: string;
  modalSlotId: string;
  accentBorderTop?: boolean;
  trackEvent?: (event: Omit<TrackEventData, 'eventType'>) => void;
  index?: number;
  totalEntry?: number;
  logger: ILogger;
  onLoginModalOpen: (redirectTo?: { modal: ModalNavigationOptions }) => void;
  navigateToModal: (props: ModalNavigationOptions) => void;
  loggedProfile?: IProfileData;
  i18n: i18n;
}

const REPLY_FRAGMENT_SIZE = 2;

const EntryRenderer = (
  props: IEntryRenderer & { replyFragmentItem: boolean; showReplyFragment: boolean },
) => {
  const {
    loginState,
    locale,
    itemId,
    itemType,
    style,
    onFlag,
    onEntryNavigate,
    navigateTo,
    sharePostUrl,
    onRepost,
    contentClickable,
    parentIsProfilePage,
    modalSlotId,
    accentBorderTop,
    trackEvent,
    itemSpacing,
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

  const postReq = usePost({ postId: itemId, enabler: itemType === EntityTypes.POST });
  const commentReq = useComment(itemId, itemType === EntityTypes.REPLY);
  const authorPubKey = React.useMemo(() => {
    if (itemType === EntityTypes.REPLY && commentReq.status === 'success') {
      return commentReq.data.author.pubKey;
    }
    if (itemType === EntityTypes.POST && postReq.status === 'success') {
      return postReq.data.author.pubKey;
    }
  }, [itemType, commentReq, postReq]);

  const followedProfilesReq = useIsFollowingMultiple(loginState.pubKey, [authorPubKey]);

  const postData = React.useMemo(() => {
    if (postReq.data && itemType === EntityTypes.POST) {
      return mapEntry(postReq.data);
    }
    return undefined;
  }, [postReq.data, itemType]);

  const commentData = React.useMemo(() => {
    if (commentReq.data && itemType === EntityTypes.REPLY) {
      return mapEntry(commentReq.data);
    }
    return undefined;
  }, [commentReq.data, itemType]);

  const isFollowing = React.useMemo(() => {
    return (
      followedProfilesReq.status === 'success' && followedProfilesReq.data.includes(authorPubKey)
    );
  }, [authorPubKey, followedProfilesReq.data, followedProfilesReq.status]);

  const itemData = React.useMemo(() => {
    if (itemType === EntityTypes.POST) {
      return postData;
    } else if (itemType === EntityTypes.REPLY) {
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
    if (authorPubKey) {
      followProfileQuery.mutate(authorPubKey);
    }
  }, [followProfileQuery, authorPubKey]);

  const handleUnfollow = React.useCallback(() => {
    if (authorPubKey) {
      unfollowProfileQuery.mutate(authorPubKey);
    }
  }, [unfollowProfileQuery, authorPubKey]);

  const handleEditClick = React.useCallback(() => {
    if (itemType === EntityTypes.REPLY) {
      setIsEditingComment(true);
    }
  }, [itemType]);

  const handleAvatarClick = () => {
    navigateTo?.({
      appName: '@akashaorg/app-profile',
      getNavigationUrl: navRoutes => `${navRoutes.rootRoute}/${itemData?.author.pubKey}`,
    });
  };

  const handleContentClick = (details: IContentClickDetails) => {
    onEntryNavigate(details, itemType);
  };

  const handleMentionClick = (pubKey: string) => {
    navigateTo?.({
      appName: '@akashaorg/app-profile',
      getNavigationUrl: navRoutes => `${navRoutes.rootRoute}/${pubKey}`,
    });
  };

  const handleTagClick = (name: string) => {
    navigateTo?.({
      appName: '@akashaorg/app-akasha-integration',
      getNavigationUrl: navRoutes => `${navRoutes.Tags}/${name}`,
    });
  };

  const handleExtensionMount = (name: string) => {
    props.uiEvents.next({
      event: EventTypes.ExtensionPointMount,
      data: {
        name,
        entryId: itemId,
        entryType: itemType,
        hideLabel: itemType === EntityTypes.POST,
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
      case EntityTypes.POST:
        return t('post');
      case EntityTypes.PROFILE:
        return t('account');
      case EntityTypes.REPLY:
        return t('reply');
      case EntityTypes.TAG:
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
        category: AnalyticsCategories.POST,
        action: 'Reply Edited',
      });
    }
    commentEditReq.mutate({
      ...commentData,
      postID: !!itemData && 'postId' in itemData && itemData.postId,
    });
    setIsEditingComment(false);
  };

  const showEditButton = React.useMemo(
    () => loginState.isReady && loginState.ethAddress === itemData?.author?.ethAddress,
    [itemData?.author?.ethAddress, loginState.ethAddress, loginState.isReady],
  );

  const isComment = React.useMemo(() => itemType === EntityTypes.REPLY, [itemType]);

  const canShowEntry =
    itemData &&
    !entryAwaitingModeration &&
    !accountAwaitingModeration &&
    !itemData.delisted &&
    !itemData.isRemoved;

  const repliesReq = useInfiniteReplies(
    {
      limit: REPLY_FRAGMENT_SIZE,
      postID: !!commentData && 'postId' in commentData && commentData?.postId,
      commentID: commentData?.entryId,
    },
    canShowEntry && props.showReplyFragment,
  );

  const replyPages = React.useMemo(() => {
    if (repliesReq.data) {
      return repliesReq.data.pages;
    }
    return [];
  }, [repliesReq.data]);

  const entryCardStyle = (): BoxExtendedProps => {
    if (!isComment) return null;

    if (props.replyFragmentItem)
      return {
        margin: { left: '1.5rem' },
        border: { color: 'replyFragmentBorder', size: '1px', side: 'left' },
      };

    if (props.index !== props.totalEntry)
      return {
        border: { color: 'border', side: 'bottom' },
      };
  };

  const entryLoading = postReq.isLoading || commentReq.isLoading;

  return (
    <Box
      margin={{ bottom: itemSpacing && (entryLoading || canShowEntry) ? `${itemSpacing}px` : null }}
    >
      {entryLoading && <EntryCardLoading />}
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
                linkPreview={itemData.linkPreview}
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
          {canShowEntry && (
            <Box {...entryCardStyle()}>
              <EntryCard
                className={props.className}
                isRemoved={itemData.isRemoved}
                entryData={itemData}
                sharePostUrl={sharePostUrl}
                sharePostLabel={t('Share Post')}
                shareTextLabel={t('Share this post with your friends')}
                onClickAvatar={handleAvatarClick}
                repliesLabel={itemType === EntityTypes.POST ? '' : t('Replies')}
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
                  display: isEditingComment ? 'none' : 'block',
                }}
                showMore={true}
                profileAnchorLink={'/@akashaorg/app-profile'}
                repliesAnchorLink={`/@akashaorg/app-akasha-integration/${
                  isComment ? 'reply' : 'post'
                }`}
                hideRepost={isComment}
                onRepost={onRepost}
                onEntryFlag={onFlag && onFlag(itemData.entryId, itemType)}
                handleFollowAuthor={handleFollow}
                handleUnfollowAuthor={handleUnfollow}
                isFollowingAuthor={isFollowing}
                onContentClick={handleContentClick}
                onMentionClick={handleMentionClick}
                onTagClick={handleTagClick}
                navigateTo={navigateTo}
                contentClickable={contentClickable}
                moderatedContentLabel={t('This content has been moderated')}
                ctaLabel={t('See it anyway')}
                handleFlipCard={handleFlipCard}
                onEntryRemove={props.onEntryRemove}
                removeEntryLabel={props.removeEntryLabel}
                removedByMeLabel={props.removedByMeLabel}
                removedByAuthorLabel={props.removedByAuthorLabel}
                disableReposting={itemData.isRemoved || isComment}
                disableReporting={loginState.waitForAuth || loginState.isSigningIn}
                modalSlotId={modalSlotId}
                noBorder={isComment}
                accentBorderTop={accentBorderTop}
                actionsRightExt={
                  !isComment && (
                    <ExtensionPoint
                      name={`entry-card-actions-right_${itemId}`}
                      onMount={handleExtensionMount}
                      onUnmount={handleExtensionUnmount}
                    />
                  )
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

              {props.showReplyFragment && (
                <Box margin={{ bottom: replyPages.length ? 'xsmall' : null }}>
                  <FeedWidget
                    modalSlotId={props.modalSlotId}
                    logger={props.logger}
                    pages={replyPages}
                    itemType={EntityTypes.REPLY}
                    onLoadMore={() => ({})}
                    getShareUrl={(itemId: string) =>
                      `${window.location.origin}/@akashaorg/app-akasha-integration/reply/${itemId}`
                    }
                    viewAllEntry={{
                      label: 'View all replies',
                      onClick: () => {
                        props.navigateTo?.({
                          appName: '@akashaorg/app-akasha-integration',
                          getNavigationUrl: navRoutes =>
                            `${navRoutes.Reply}/${commentData?.entryId}`,
                        });
                      },
                      limit: REPLY_FRAGMENT_SIZE,
                    }}
                    loginState={loginState}
                    navigateTo={navigateTo}
                    navigateToModal={props.navigateToModal}
                    requestStatus={repliesReq.status}
                    hasNextPage={repliesReq.hasNextPage}
                    loggedProfile={props.loggedProfile}
                    contentClickable={true}
                    onEntryFlag={props.onFlag}
                    onEntryRemove={props.onEntryRemove}
                    removeEntryLabel={t('Delete Reply')}
                    removedByMeLabel={t('You deleted this reply')}
                    removedByAuthorLabel={t('This reply was deleted by its author')}
                    uiEvents={props.uiEvents}
                    itemSpacing={8}
                    i18n={props.i18n}
                    trackEvent={props.trackEvent}
                    onLoginModalOpen={props.onLoginModalOpen}
                    replyFragmentItem={true}
                  />
                </Box>
              )}
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default React.memo(EntryRenderer);

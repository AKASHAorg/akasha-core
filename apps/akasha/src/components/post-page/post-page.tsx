import * as React from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import DS from '@akashaproject/design-system';
import { RootComponentProps } from '@akashaproject/ui-awf-typings';
import { ILocale } from '@akashaproject/design-system/lib/utils/time';
import {
  getLinkPreview,
  uploadMediaToTextile,
  LoginState,
  useIsFollowingMultiple,
  useFollow,
  useUnfollow,
  useInfiniteComments,
  useCreateComment,
  useGetBookmarks,
  useSaveBookmark,
  useDeleteBookmark,
  usePost,
  useTagSearch,
  mapEntry,
  useGetProfile,
  useMentionSearch,
  useHandleNavigation,
} from '@akashaproject/ui-awf-hooks';

import { IPublishData } from '@akashaproject/ui-awf-typings/lib/entry';
import FeedWidget from '@akashaproject/ui-widget-feed/lib/components/App';
import { ItemTypes, EventTypes } from '@akashaproject/ui-awf-typings/lib/app-loader';
import { ModalNavigationOptions } from '@akashaproject/ui-awf-typings/lib/app-loader';
import { redirect } from '../../services/routing-service';
import routes, { POST } from '../../routes';

const {
  Box,
  MainAreaCardBox,
  EntryBox,
  Helmet,
  CommentEditor,
  EditorPlaceholder,
  EntryCardHidden,
  ErrorLoader,
  EntryCardLoading,
  ExtensionPoint,
} = DS;

interface IPostPageProps {
  loginState?: LoginState;
  showLoginModal: (redirectTo?: { modal: ModalNavigationOptions }) => void;
}

const PostPage: React.FC<IPostPageProps & RootComponentProps> = props => {
  const {
    showLoginModal,
    logger,
    singleSpa: { navigateToUrl },
    loginState,
  } = props;

  const [showAnyway, setShowAnyway] = React.useState<boolean>(false);

  const { postId } = useParams<{ userId: string; postId: string }>();
  const { t, i18n } = useTranslation();

  const postReq = usePost({
    postId,
    loggedUser: loginState?.pubKey,
    enabler: loginState?.fromCache,
  });
  const entryData = React.useMemo(() => {
    if (postReq.data) {
      return mapEntry(postReq.data);
    }
    return undefined;
  }, [postReq.data]);

  const isReported = React.useMemo(() => {
    if (showAnyway) {
      return false;
    }
    return postReq.isSuccess && entryData.reported;
  }, [entryData, showAnyway, postReq.isSuccess]);

  const disablePublishing = React.useMemo(
    () => loginState.waitForAuth || !loginState.isReady,
    [loginState],
  );

  const [mentionQuery, setMentionQuery] = React.useState(null);
  const [tagQuery, setTagQuery] = React.useState(null);
  const mentionQueryReq = useMentionSearch(mentionQuery);
  const tagQueryReq = useTagSearch(tagQuery);

  const reqComments = useInfiniteComments(15, postId);

  const commentPages = React.useMemo(() => {
    if (reqComments.data) {
      return reqComments.data.pages;
    }
    return [];
  }, [reqComments.data]);

  const locale = (i18n.languages[0] || 'en') as ILocale;

  const profileDataReq = useGetProfile(loginState?.pubKey);
  const loggedProfileData = profileDataReq.data;

  const isFollowingMultipleReq = useIsFollowingMultiple(loginState?.ethAddress, [
    entryData?.author?.ethAddress,
  ]);
  const followedProfiles = isFollowingMultipleReq.data;
  const followReq = useFollow();
  const unfollowReq = useUnfollow();

  const bookmarksReq = useGetBookmarks(loginState?.isReady && loginState?.ethAddress);
  const bookmarks = bookmarksReq.data;
  const addBookmark = useSaveBookmark();
  const deleteBookmark = useDeleteBookmark();

  const handleFollow = () => {
    if (entryData?.author.ethAddress) {
      followReq.mutate(entryData?.author.ethAddress);
    }
  };

  const handleUnfollow = () => {
    if (entryData.author.ethAddress) {
      unfollowReq.mutate(entryData?.author.ethAddress);
    }
  };

  const isFollowing = followedProfiles.includes(entryData?.author?.ethAddress);

  const handleLoadMore = () => {
    if (reqComments.isSuccess && reqComments.hasNextPage && loginState?.fromCache) {
      reqComments.fetchNextPage();
    }
  };

  const bookmarked = React.useMemo(() => {
    return !bookmarksReq.isFetching && bookmarks?.findIndex(bm => bm.entryId === postId) >= 0;
  }, [bookmarksReq.isFetching, bookmarks, postId]);

  const handleMentionClick = (pubKey: string) => {
    navigateToUrl(`/profile/${pubKey}`);
  };

  const handleTagClick = (name: string) => {
    navigateToUrl(`/social-app/tags/${name}`);
  };

  const handleAvatarClick = (ev: React.MouseEvent<HTMLDivElement>, pubKey: string) => {
    navigateToUrl(`/profile/${pubKey}`);
    ev.preventDefault();
  };

  const handleEntryBookmark = (itemType: ItemTypes) => (entryId: string) => {
    if (!loginState?.ethAddress) {
      return showLoginModal();
    }
    if (bookmarks.findIndex(bm => bm.entryId === entryId) >= 0) {
      return deleteBookmark.mutate(entryId);
    }
    return addBookmark.mutate({ entryId, itemType });
  };

  const handleEntryFlag = (entryId: string, itemType: string) => () => {
    if (!loginState?.pubKey) {
      return showLoginModal({ modal: { name: 'report-modal', entryId, itemType } });
    }
    props.navigateToModal({ name: 'report-modal', entryId, itemType });
  };

  const publishComment = useCreateComment();

  const handlePublishComment = async (data: IPublishData) => {
    publishComment.mutate({ ...data, postID: postId });
  };

  const handleRepost = (_withComment: boolean, entryId: string) => {
    if (!loginState?.ethAddress) {
      showLoginModal();
      return;
    } else {
      props.navigateToModal({ name: 'editor', embedEntry: entryId });
    }
  };

  const handleNavigate = useHandleNavigation(navigateToUrl, postId);

  const handleSingleSpaNavigate = redirect(navigateToUrl);

  const handleFlipCard = () => {
    setShowAnyway(true);
  };

  const onEditPostButtonMount = (name: string) => {
    props.uiEvents.next({
      event: EventTypes.ExtensionPointMount,
      data: {
        name,
        entryId: entryData.entryId,
        entryType: ItemTypes.ENTRY,
      },
    });
  };
  const onEditPostButtonUnmount = () => {
    /* todo */
  };

  const entryAuthorName =
    entryData?.author?.name || entryData?.author?.userName || entryData?.author?.ethAddress;

  const handleCommentRemove = (commentId: string) => {
    props.navigateToModal({
      name: 'entry-remove-confirmation',
      entryType: ItemTypes.COMMENT,
      entryId: commentId,
    });
  };

  const handlePostRemove = (commentId: string) => {
    props.navigateToModal({
      name: 'entry-remove-confirmation',
      entryType: ItemTypes.ENTRY,
      entryId: commentId,
    });
  };

  const handlePlaceholderClick = () => {
    showLoginModal();
  };

  const handleMentionQueryChange = (query: string) => {
    setMentionQuery(query);
  };
  const handleTagQueryChange = (query: string) => {
    setTagQuery(query);
  };

  const showEditButton = React.useMemo(
    () => loginState.isReady && loginState.ethAddress === entryData?.author?.ethAddress,
    [entryData?.author?.ethAddress, loginState.ethAddress, loginState.isReady],
  );

  const showEntry = React.useMemo(
    () => !entryData?.delisted && (!isReported || (isReported && entryData?.moderated)),
    [entryData?.delisted, entryData?.moderated, isReported],
  );

  return (
    <MainAreaCardBox style={{ height: 'auto' }}>
      <Helmet>
        <title>Post | Ethereum World</title>
      </Helmet>
      {postReq.isLoading && <EntryCardLoading />}
      {postReq.isError && (
        <ErrorLoader
          type="script-error"
          title={t('There was an error loading the entry')}
          details={t('We cannot show this entry right now')}
          devDetails={postReq.error}
        />
      )}
      {postReq.isSuccess && (
        <>
          {entryData.moderated && entryData.delisted && (
            <EntryCardHidden
              moderatedContentLabel={t('This content has been moderated')}
              isDelisted={true}
            />
          )}
          {!entryData.moderated && isReported && (
            <EntryCardHidden
              reason={entryData.reason}
              headerTextLabel={t('You reported this post for the following reason')}
              footerTextLabel={t('It is awaiting moderation.')}
              ctaLabel={t('See it anyway')}
              handleFlipCard={handleFlipCard}
            />
          )}
          {showEntry && (
            <>
              <Box
                pad={{ bottom: 'small' }}
                border={{ side: 'bottom', size: '1px', color: 'border' }}
              >
                <EntryBox
                  isRemoved={entryData.isRemoved}
                  isBookmarked={bookmarked}
                  entryData={entryData}
                  sharePostLabel={t('Share Post')}
                  shareTextLabel={t('Share this post with your friends')}
                  sharePostUrl={`${window.location.origin}${routes[POST]}/`}
                  onClickAvatar={(ev: React.MouseEvent<HTMLDivElement>) =>
                    handleAvatarClick(ev, entryData.author.pubKey)
                  }
                  onEntryBookmark={handleEntryBookmark(ItemTypes.ENTRY)}
                  repliesLabel={t('Replies')}
                  repostsLabel={t('Reposts')}
                  repostLabel={t('Repost')}
                  repostWithCommentLabel={t('Repost with comment')}
                  shareLabel={t('Share')}
                  copyLinkLabel={t('Copy Link')}
                  flagAsLabel={t('Report Post')}
                  loggedProfileEthAddress={loginState.isReady && loginState?.ethAddress}
                  locale={locale}
                  bookmarkLabel={t('Save')}
                  bookmarkedLabel={t('Saved')}
                  showMore={true}
                  profileAnchorLink={'/profile'}
                  repliesAnchorLink={routes[POST]}
                  onRepost={handleRepost}
                  onEntryFlag={handleEntryFlag(entryData.entryId, 'post')}
                  handleFollowAuthor={handleFollow}
                  handleUnfollowAuthor={handleUnfollow}
                  isFollowingAuthor={isFollowing}
                  onContentClick={handleNavigate}
                  singleSpaNavigate={handleSingleSpaNavigate}
                  onMentionClick={handleMentionClick}
                  onTagClick={handleTagClick}
                  moderatedContentLabel={t('This content has been moderated')}
                  ctaLabel={t('See it anyway')}
                  handleFlipCard={handleFlipCard}
                  scrollHiddenContent={true}
                  onEntryRemove={handlePostRemove}
                  removeEntryLabel={t('Delete Post')}
                  removedByMeLabel={t('You deleted this post')}
                  removedByAuthorLabel={t('This post was deleted by its author')}
                  disableReposting={entryData.isRemoved}
                  disableReporting={loginState.waitForAuth || loginState.isSigningIn}
                  modalSlotId={props.layoutConfig.modalSlotId}
                  headerMenuExt={
                    showEditButton && (
                      <ExtensionPoint
                        style={{ width: '100%' }}
                        name={`entry-card-edit-button_${entryData.entryId}`}
                        onMount={onEditPostButtonMount}
                        onUnmount={onEditPostButtonUnmount}
                      />
                    )
                  }
                />
              </Box>
              {!loginState?.ethAddress && (
                <Box margin="medium">
                  <EditorPlaceholder onClick={handlePlaceholderClick} ethAddress={null} />
                </Box>
              )}
              {loginState?.ethAddress && !entryData.isRemoved && (
                <Box margin="medium" style={{ position: 'relative' }}>
                  <CommentEditor
                    avatar={loggedProfileData?.avatar}
                    ethAddress={loginState?.ethAddress}
                    postLabel={t('Reply')}
                    placeholderLabel={`${t('Reply to')} ${entryAuthorName || ''}`}
                    emojiPlaceholderLabel={t('Search')}
                    disablePublishLabel={t('Authenticating')}
                    disablePublish={disablePublishing}
                    onPublish={handlePublishComment}
                    getLinkPreview={getLinkPreview}
                    getMentions={handleMentionQueryChange}
                    getTags={handleTagQueryChange}
                    tags={tagQueryReq.data}
                    mentions={mentionQueryReq.data}
                    uploadRequest={uploadMediaToTextile}
                  />
                </Box>
              )}
              {publishComment.isLoading && publishComment.variables.postID === postId && (
                <Box
                  pad={{ horizontal: 'medium' }}
                  border={{ side: 'bottom', size: '1px', color: 'border' }}
                  style={{ backgroundColor: '#4e71ff0f' }}
                >
                  <EntryBox
                    isBookmarked={false}
                    entryData={{
                      ...publishComment.variables,
                      author: loggedProfileData,
                      ipfsLink: '',
                      permalink: '',
                      entryId: '',
                    }}
                    sharePostLabel={t('Share Post')}
                    shareTextLabel={t('Share this post with your friends')}
                    repliesLabel={t('Replies')}
                    repostsLabel={t('Reposts')}
                    repostLabel={t('Repost')}
                    repostWithCommentLabel={t('Repost with comment')}
                    shareLabel={t('Share')}
                    copyLinkLabel={t('Copy Link')}
                    flagAsLabel={t('Report Comment')}
                    loggedProfileEthAddress={loggedProfileData.ethAddress}
                    locale={'en'}
                    bookmarkLabel={t('Save')}
                    bookmarkedLabel={t('Saved')}
                    showMore={true}
                    profileAnchorLink={'/profile'}
                    repliesAnchorLink={routes[POST]}
                    handleFollowAuthor={handleFollow}
                    handleUnfollowAuthor={handleUnfollow}
                    isFollowingAuthor={isFollowing}
                    contentClickable={false}
                    hidePublishTime={true}
                    disableActions={true}
                    hideActionButtons={true}
                    modalSlotId={props.layoutConfig.modalSlotId}
                  />
                </Box>
              )}
              <FeedWidget
                modalSlotId={props.layoutConfig.modalSlotId}
                logger={logger}
                pages={commentPages}
                itemType={ItemTypes.COMMENT}
                onLoadMore={handleLoadMore}
                getShareUrl={(itemId: string) =>
                  `${window.location.origin}/social-app/post/${itemId}`
                }
                loginState={loginState}
                singleSpaNavigate={navigateToUrl}
                navigateToModal={props.navigateToModal}
                onLoginModalOpen={showLoginModal}
                requestStatus={reqComments.status}
                hasNextPage={reqComments.hasNextPage}
                loggedProfile={loggedProfileData}
                contentClickable={true}
                onEntryFlag={handleEntryFlag}
                onEntryRemove={handleCommentRemove}
                removeEntryLabel={t('Delete Reply')}
                removedByMeLabel={t('You deleted this reply')}
                removedByAuthorLabel={t('This reply was deleted by its author')}
                uiEvents={props.uiEvents}
                itemSpacing={8}
                i18n={i18n}
              />
            </>
          )}
        </>
      )}
    </MainAreaCardBox>
  );
};

export default PostPage;

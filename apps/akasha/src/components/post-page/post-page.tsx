import * as React from 'react';
import { useParams } from 'react-router-dom';
import DS from '@akashaproject/design-system';
import { useMentions, useErrors } from '@akashaproject/ui-awf-hooks';
import { useTranslation } from 'react-i18next';
import { ILocale } from '@akashaproject/design-system/lib/utils/time';
import { uploadMediaToTextile } from '@akashaproject/ui-awf-hooks/lib/utils/media-utils';
import { redirect, redirectToPost } from '../../services/routing-service';
import PostRenderer from './post-renderer';
import routes, { POST } from '../../routes';
import { RootComponentProps } from '@akashaproject/ui-awf-typings';
import { ILoginState } from '@akashaproject/ui-awf-hooks/lib/use-login-state';
import { usePost } from '@akashaproject/ui-awf-hooks/lib/use-posts.new';
import { ItemTypes, EventTypes } from '@akashaproject/ui-awf-typings/lib/app-loader';
import {
  useInfiniteComments,
  useCreateComment,
} from '@akashaproject/ui-awf-hooks/lib/use-comments.new';
import {
  useGetBookmarks,
  useBookmarkPost,
  useBookmarkDelete,
} from '@akashaproject/ui-awf-hooks/lib/use-bookmarks.new';
import {
  useIsFollowing,
  useFollow,
  useUnfollow,
} from '@akashaproject/ui-awf-hooks/lib/use-follow.new';
import { useGetProfile } from '@akashaproject/ui-awf-hooks/lib/use-profile.new';
// import { useTags, useMentions } from '@akashaproject/ui-awf-hooks/lib/use-mentions.new';
import { mapEntry } from '@akashaproject/ui-awf-hooks/lib/utils/entry-utils';
import { PublishPostData } from '@akashaproject/ui-awf-hooks/lib/use-posts';

const {
  Box,
  MainAreaCardBox,
  EntryBox,
  EntryList,
  Helmet,
  CommentEditor,
  EditorPlaceholder,
  EntryCardHidden,
  ErrorInfoCard,
  ErrorLoader,
  EntryCardLoading,
  ExtensionPoint,
} = DS;

interface IPostPage {
  loginState: ILoginState;
  showLoginModal: () => void;
  navigateToUrl: (path: string) => void;
  isMobile: boolean;
}

const PostPage: React.FC<IPostPage & RootComponentProps> = props => {
  const { showLoginModal, logger, navigateToUrl, loginState, isMobile } = props;

  const [showAnyway, setShowAnyway] = React.useState<boolean>(false);

  const { postId } = useParams<{ userId: string; postId: string }>();
  const { t, i18n } = useTranslation();
  const [, errorActions] = useErrors({ logger });

  //@Todo: replace entryData with value from usePost
  const postReq = usePost(postId, !!postId);
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
    return postReq.status === 'success' && entryData.reported;
  }, [entryData, showAnyway, postReq.status]);

  const [mentionsState, mentionsActions] = useMentions({
    onError: errorActions.createError,
  });

  const reqComments = useInfiniteComments(15, postId);

  const commentPages = React.useMemo(() => {
    if (reqComments.data) {
      return reqComments.data.pages;
    }
    return [];
  }, [reqComments.data]);

  const locale = (i18n.languages[0] || 'en') as ILocale;

  const profileDataReq = useGetProfile(loginState.pubKey);
  const loggedProfileData = profileDataReq.data;

  const isFollowingMultipleReq = useIsFollowing(
    loginState.ethAddress,
    entryData?.author?.ethAddress,
  );
  const followedProfiles = isFollowingMultipleReq.data;
  const followReq = useFollow();
  const unfollowReq = useUnfollow();

  const bookmarksReq = useGetBookmarks(loginState.ready?.ethAddress);
  const bookmarks = bookmarksReq.data;
  const addBookmark = useBookmarkPost();
  const deleteBookmark = useBookmarkDelete();

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
    if (
      reqComments.status === 'success' &&
      reqComments.hasNextPage &&
      loginState.currentUserCalled
    ) {
      reqComments.fetchNextPage();
    }
  };

  // React.useEffect(() => {
  //   // this is used to initialise comments when navigating to other post ids
  //   if (postId && loginState.currentUserCalled) {
  //     // postsActions.getPost(postId);
  //     handleLoadMore();
  //     // if (loginState.ethAddress) {
  //     //   bookmarkActions.getBookmarks();
  //     // }
  //   }
  // }, [postId, loginState.currentUserCalled, loginState.ethAddress]);

  const bookmarked = React.useMemo(() => {
    return !bookmarksReq.isFetching && bookmarks?.findIndex(bm => bm.entryId === postId) >= 0;
  }, [bookmarksReq.isFetching, bookmarks, postId]);

  const handleMentionClick = (pubKey: string) => {
    navigateToUrl(`/profile/${pubKey}`);
  };

  const handleTagClick = (name: string) => {
    props.singleSpa.navigateToUrl(`/social-app/tags/${name}`);
  };

  const handleAvatarClick = (ev: React.MouseEvent<HTMLDivElement>, pubKey: string) => {
    navigateToUrl(`/profile/${pubKey}`);
    ev.preventDefault();
  };

  const handleEntryBookmark = (entryId: string) => {
    if (!loginState.ethAddress) {
      return showLoginModal();
    }
    if (bookmarks.findIndex(bm => bm.entryId === entryId) >= 0) {
      return deleteBookmark.mutate(entryId);
    }
    return addBookmark.mutate(entryId);
  };

  const handleCommentRepost = () => {
    // todo
  };

  const handleEntryFlag = (entryId: string, contentType: string) => () => {
    props.navigateToModal({ name: 'report-modal', entryId, contentType });
  };

  const publishComment = useCreateComment();

  const handlePublishComment = async (data: PublishPostData) => {
    publishComment.mutate({ ...data, postID: postId });
  };

  const handleRepost = (_withComment: boolean, entryId: any) => {
    if (!loginState.ethAddress) {
      showLoginModal();
      return;
    } else {
      props.navigateToModal({ name: 'editor', embedEntry: entryId });
    }
  };

  const handleNavigateToPost = redirectToPost(
    navigateToUrl,
    postId /*, postsActions.resetPostIds*/,
  );

  const handleSingleSpaNavigate = redirect(navigateToUrl /*postsActions.resetPostIds*/);

  const onUploadRequest = uploadMediaToTextile;

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

  const commentErrors = errorActions.getFilteredErrors('usePosts.getComments');

  const entryAuthorName =
    entryData?.author?.name || entryData?.author?.userName || entryData?.author?.ethAddress;

  const handleCommentRemove = (commentId: string) => {
    props.navigateToModal({
      name: 'entry-remove-confirmation',
      entryType: 'Comment',
      entryId: commentId,
    });
  };

  const handlePostRemove = (commentId: string) => {
    props.navigateToModal({
      name: 'entry-remove-confirmation',
      entryType: 'Post',
      entryId: commentId,
    });
  };
  return (
    <MainAreaCardBox style={{ height: 'auto' }}>
      <Helmet>
        <title>Post | Ethereum World</title>
      </Helmet>
      {postReq.status === 'loading' && <EntryCardLoading />}
      {postReq.status === 'error' && (
        <ErrorLoader
          type="script-error"
          title={t('There was an error loading the entry')}
          details={t('We cannot show this entry right now')}
          devDetails={postReq.error}
        />
      )}
      {postReq.status === 'success' && (
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
          {!entryData.moderated && !isReported && (
            <>
              <Box
                pad={{ bottom: 'small' }}
                border={{ side: 'bottom', size: '1px', color: 'border' }}
              >
                <EntryBox
                  isRemoved={
                    entryData.content.length === 1 && entryData.content[0].property === 'removed'
                  }
                  isBookmarked={bookmarked}
                  entryData={entryData}
                  sharePostLabel={t('Share Post')}
                  shareTextLabel={t('Share this post with your friends')}
                  sharePostUrl={`${window.location.origin}${routes[POST]}/`}
                  onClickAvatar={(ev: React.MouseEvent<HTMLDivElement>) =>
                    handleAvatarClick(ev, entryData.author.pubKey)
                  }
                  onEntryBookmark={handleEntryBookmark}
                  repliesLabel={t('Replies')}
                  repostsLabel={t('Reposts')}
                  repostLabel={t('Repost')}
                  repostWithCommentLabel={t('Repost with comment')}
                  shareLabel={t('Share')}
                  copyLinkLabel={t('Copy Link')}
                  flagAsLabel={t('Report Post')}
                  loggedProfileEthAddress={loginState.ethAddress}
                  locale={locale}
                  bookmarkLabel={t('Save')}
                  bookmarkedLabel={t('Saved')}
                  profileAnchorLink={'/profile'}
                  repliesAnchorLink={routes[POST]}
                  onRepost={handleRepost}
                  onEntryFlag={handleEntryFlag(entryData.entryId, 'post')}
                  handleFollowAuthor={handleFollow}
                  handleUnfollowAuthor={handleUnfollow}
                  isFollowingAuthor={isFollowing}
                  onContentClick={handleNavigateToPost}
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
                  headerMenuExt={
                    loginState.ethAddress === entryData.author.ethAddress && (
                      <ExtensionPoint
                        name={`entry-card-edit-button_${entryData.entryId}`}
                        onMount={onEditPostButtonMount}
                        onUnmount={onEditPostButtonUnmount}
                      />
                    )
                  }
                />
              </Box>
              {!loginState.ethAddress && (
                <Box margin="medium">
                  <EditorPlaceholder onClick={showLoginModal} ethAddress={null} />
                </Box>
              )}
              {loginState.ethAddress && (
                <Box margin="medium">
                  <CommentEditor
                    avatar={loggedProfileData?.avatar}
                    ethAddress={loginState.ethAddress}
                    postLabel={t('Reply')}
                    placeholderLabel={`${t('Reply to')} ${entryAuthorName || ''}`}
                    emojiPlaceholderLabel={t('Search')}
                    onPublish={handlePublishComment}
                    getMentions={mentionsActions.getMentions}
                    getTags={mentionsActions.getTags}
                    tags={mentionsState.tags}
                    mentions={mentionsState.mentions}
                    uploadRequest={onUploadRequest}
                  />
                </Box>
              )}
              <ErrorInfoCard errors={commentErrors}>
                {(errorMessages, hasCriticalErrors) => (
                  <>
                    {hasCriticalErrors && (
                      <ErrorLoader
                        type="script-error"
                        title={t('A critical error occured when loading the list')}
                        details={t('Cannot fetch one or more comments!')}
                      />
                    )}
                    {!hasCriticalErrors && errorMessages && (
                      <ErrorLoader
                        type="script-error"
                        title={t('Loading the list of comments failed')}
                        details={t('An unexpected error occured! Please try to refresh the page')}
                      />
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
                          profileAnchorLink={'/profile'}
                          repliesAnchorLink={routes[POST]}
                          handleFollowAuthor={handleFollow}
                          handleUnfollowAuthor={handleUnfollow}
                          isFollowingAuthor={isFollowing}
                          contentClickable={false}
                          hidePublishTime={true}
                          disableActions={true}
                          hideActionButtons={true}
                        />
                      </Box>
                    )}
                    {!hasCriticalErrors && (
                      <EntryList
                        pages={commentPages}
                        status={reqComments.status}
                        onLoadMore={handleLoadMore}
                        hasNextPage={reqComments.hasNextPage}
                        itemCard={
                          <PostRenderer
                            logger={logger}
                            bookmarkState={bookmarksReq}
                            ethAddress={loginState.ethAddress}
                            locale={locale}
                            onBookmark={handleEntryBookmark}
                            onNavigate={handleNavigateToPost}
                            sharePostUrl={`${window.location.origin}${routes[POST]}/`}
                            onFlag={handleEntryFlag}
                            onRepost={handleCommentRepost}
                            onAvatarClick={handleAvatarClick}
                            onMentionClick={handleMentionClick}
                            onTagClick={handleTagClick}
                            singleSpaNavigate={handleSingleSpaNavigate}
                            headerTextLabel={t('You reported this reply for the following reason')}
                            footerTextLabel={t('It is awaiting moderation.')}
                            moderatedContentLabel={t('This content has been moderated')}
                            ctaLabel={t('See it anyway')}
                            onEntryRemove={handleCommentRemove}
                            removeEntryLabel={t('Delete Reply')}
                            removedByMeLabel={t('You deleted this reply')}
                            removedByAuthorLabel={t('This reply was deleted by its author')}
                          />
                        }
                      />
                    )}
                  </>
                )}
              </ErrorInfoCard>
            </>
          )}
        </>
      )}
    </MainAreaCardBox>
  );
};

export default PostPage;

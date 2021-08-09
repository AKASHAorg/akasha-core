import * as React from 'react';
import { useParams } from 'react-router-dom';
import DS from '@akashaproject/design-system';
import { useMentions, useErrors } from '@akashaproject/ui-awf-hooks';
import { useTranslation } from 'react-i18next';
import { ILocale } from '@akashaproject/design-system/lib/utils/time';
import { uploadMediaToTextile } from '@akashaproject/ui-awf-hooks/lib/utils/media-utils';
import { redirect, redirectToPost } from '../../services/routing-service';
import PostRenderer from './post-renderer';
import { getPendingComments } from './post-page-pending-comments';
import routes, { POST } from '../../routes';
import { IAkashaError, RootComponentProps } from '@akashaproject/ui-awf-typings';
import { ILoginState } from '@akashaproject/ui-awf-hooks/lib/use-login-state';
import { usePost } from '@akashaproject/ui-awf-hooks/lib/use-posts.new';
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
import { mapEntry, buildPublishObject } from '@akashaproject/ui-awf-hooks/lib/utils/entry-utils';
import { PublishPostData } from '@akashaproject/ui-awf-hooks/lib/use-posts';

const {
  Box,
  MainAreaCardBox,
  EntryBox,
  VirtualList,
  Helmet,
  CommentEditor,
  EditorPlaceholder,
  // EntryCardHidden,
  ErrorInfoCard,
  ErrorLoader,
  EntryCardLoading,
} = DS;

interface IPostPage {
  loginState: ILoginState;
  showLoginModal: () => void;
  navigateToUrl: (path: string) => void;
  isMobile: boolean;
  onError: (err: IAkashaError) => void;
}

const PostPage: React.FC<IPostPage & RootComponentProps> = props => {
  const { showLoginModal, logger, navigateToUrl, loginState, isMobile } = props;

  const { postId } = useParams<{ userId: string; postId: string }>();
  const { t, i18n } = useTranslation();
  const [, errorActions] = useErrors({ logger });

  const postReq = usePost(postId);
  const entryData = postReq.data;

  const [mentionsState, mentionsActions] = useMentions({
    onError: errorActions.createError,
  });

  //@Todo: remove this when usePost is used
  //react-query caches automatically everything
  // const entryData = React.useMemo(() => {
  //   if (postId && postsState.postsData[postId]) {
  //     return postsState.postsData[postId];
  //   }
  //   return null;
  // }, [postId, postsState.postsData[postId]]);

  const reqComments = useInfiniteComments(15, postId);
  const commentsState = reqComments.data;
  const ids = React.useMemo(() => {
    const list = [];
    if (!reqComments.isSuccess) {
      return list;
    }
    commentsState.pages.forEach(el => el.results.forEach(el1 => list.push(el1._id)));
    return list;
  }, [reqComments.isSuccess]);

  const commentsData = React.useMemo(() => {
    const list = {};
    if (!reqComments.isSuccess) {
      return list;
    }
    commentsState.pages.forEach(el => el.results.forEach(el1 => (list[el1._id] = mapEntry(el1))));
    return list;
  }, [reqComments.isSuccess]);

  const locale = (i18n.languages[0] || 'en') as ILocale;

  const profileDataReq = useGetProfile(loginState.pubKey);
  const loggedProfileData = profileDataReq.data;

  // React.useEffect(() => {
  //   if (loginState.pubKey) {
  //     loginProfileActions.getProfileData({ pubKey: loginState.pubKey });
  //   }
  // }, [loginState.pubKey]);

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

  // React.useEffect(() => {
  //   if (loginState.ethAddress && entryData?.author.ethAddress) {
  //     followActions.isFollowing(loginState.ethAddress, entryData.author.ethAddress);
  //   }
  // }, [loginState.ethAddress, entryData?.author.ethAddress]);

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
    if (!reqComments.isFetching && loginState.currentUserCalled) {
      reqComments.fetchNextPage().then(d => console.log('fetched next page', d));
    }
  };

  const loadItemData = () => {
    // postsActions.getComment(payload.itemId);
  };

  React.useEffect(() => {
    // this is used to initialise comments when navigating to other post ids
    if (postId && loginState.currentUserCalled) {
      // postsActions.getPost(postId);
      handleLoadMore();
      // if (loginState.ethAddress) {
      //   bookmarkActions.getBookmarks();
      // }
    }
  }, [postId, loginState.currentUserCalled, loginState.ethAddress]);

  const bookmarked = React.useMemo(() => {
    return !bookmarksReq.isFetching && bookmarks.findIndex(bm => bm.entryId === postId) >= 0;
  }, [bookmarks]);

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
    publishComment.mutate(buildPublishObject(data, postId));
  };

  // const handlePublishComment = async (data: {
  //   metadata: {
  //     app: string;
  //     version: number;
  //     quote?: string;
  //     tags: string[];
  //     mentions: string[];
  //   };
  //   author: string;
  //   content: any;
  //   textContent: any;
  // }) => {
  //   if (!loginState.ethAddress) {
  //     showLoginModal();
  //     return;
  //   }
  //   postsActions.optimisticPublishComment(data, postId, loginProfile);
  // };

  const handleRepost = (_withComment: boolean, entryData: any) => {
    props.navigateToModal({ name: 'editor', embedEntry: entryData });
  };

  const handleNavigateToPost = redirectToPost(
    navigateToUrl,
    postId /*, postsActions.resetPostIds*/,
  );

  const handleSingleSpaNavigate = redirect(navigateToUrl /*postsActions.resetPostIds*/);

  const onUploadRequest = uploadMediaToTextile;

  // @TODO: replace with mutation
  const handleFlipCard = (_entry: any, _isQuote: boolean) => () => {
    // modify entry or its quote (if applicable)
    // const modifiedEntry = isQuote
    //   ? { ...entry, quote: { ...entry.quote, reported: false } }
    //   : { ...entry, reported: false };
    // postsActions.updatePostsState(modifiedEntry);
  };

  // @TODO replace with moderation react query integration
  // if (postsState.delistedItems.includes(postId)) {
  //   return (
  //     <EntryCardHidden
  //       moderatedContentLabel={t('This content has been moderated')}
  //       isDelisted={true}
  //     />
  //   );
  // }
  // @TODO replace with moderation react query integration
  // if (!postsState.delistedItems.includes(postId) && postsState.reportedItems.includes(postId)) {
  //   return (
  //     <EntryCardHidden
  //       awaitingModerationLabel={t('You have reported this content. It is awaiting moderation.')}
  //       ctaLabel={t('See it anyway')}
  //       handleFlipCard={handleFlipCard(entryData, false)}
  //     />
  //   );
  // }

  const postErrors = errorActions.getFilteredErrors('usePost.getPost');
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
      <Box pad={{ bottom: 'small' }} border={{ side: 'bottom', size: '1px', color: 'border' }}>
        <ErrorInfoCard errors={postErrors}>
          {(errorMessages, hasCriticalErrors) => (
            <>
              {hasCriticalErrors && (
                // @Todo: replace this logic with (entryData.status === "error")
                // the error message is on entryData.error.message
                <ErrorLoader
                  type="script-error"
                  title={t('Sorry, there was an error loading this post')}
                  details={t('We cannot recover from this error!')}
                  devDetails={errorMessages}
                />
              )}
              {errorMessages && !hasCriticalErrors && (
                <ErrorLoader
                  type="script-error"
                  title={t('Loading the post failed')}
                  details={t('An unexpected error occurred! Please try to refresh the page')}
                  devDetails={errorMessages}
                />
              )}
              {!hasCriticalErrors && (
                <>
                  {
                    // @Todo: replace this logic with (entryData.status === "loading")
                    //
                    postReq.isLoading && (
                      <EntryCardLoading
                        style={{ background: 'transparent', boxShadow: 'none', border: 0 }}
                      />
                    )
                  }
                  {entryData && (
                    <EntryBox
                      isRemoved={
                        entryData.content.length === 1 &&
                        entryData.content[0].property === 'removed'
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
                      awaitingModerationLabel={t(
                        'You have reported this content. It is awaiting moderation.',
                      )}
                      moderatedContentLabel={t('This content has been moderated')}
                      ctaLabel={t('See it anyway')}
                      handleFlipCard={handleFlipCard}
                      scrollHiddenContent={true}
                      onEntryRemove={handlePostRemove}
                      removeEntryLabel={t('Delete Post')}
                      removedByMeLabel={t('You deleted this post')}
                      removedByAuthorLabel={t('This post was deleted by its author')}
                    />
                  )}
                </>
              )}
            </>
          )}
        </ErrorInfoCard>
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
            {!hasCriticalErrors && (
              <VirtualList
                items={ids}
                itemsData={commentsData}
                loadMore={handleLoadMore}
                loadItemData={loadItemData}
                hasMoreItems={!!reqComments.hasNextPage}
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
                    handleFlipCard={handleFlipCard}
                    onEntryRemove={handleCommentRemove}
                    removeEntryLabel={t('Delete Reply')}
                    removedByMeLabel={t('You deleted this reply')}
                    removedByAuthorLabel={t('This reply was deleted by its author')}
                  />
                }
                customEntities={getPendingComments({
                  logger,
                  locale,
                  isMobile,
                  feedItems: ids,
                  loggedEthAddress: loginState.ethAddress,
                  pendingComments: [],
                })}
              />
            )}
          </>
        )}
      </ErrorInfoCard>
    </MainAreaCardBox>
  );
};

export default PostPage;

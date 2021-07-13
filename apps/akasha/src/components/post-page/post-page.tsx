import * as React from 'react';
import { useParams } from 'react-router-dom';
import DS from '@akashaproject/design-system';
import { ILoadItemDataPayload } from '@akashaproject/design-system/lib/components/VirtualList/interfaces';
import {
  usePosts,
  useBookmarks,
  useMentions,
  useProfile,
  useFollow,
  useErrors,
} from '@akashaproject/ui-awf-hooks';
import { useTranslation } from 'react-i18next';
import { ILocale } from '@akashaproject/design-system/lib/utils/time';
import { uploadMediaToTextile } from '@akashaproject/ui-awf-hooks/lib/utils/media-utils';
import { redirect, redirectToPost } from '../../services/routing-service';
import PostRenderer from './post-renderer';
import { getPendingComments } from './post-page-pending-comments';
import routes, { POST } from '../../routes';
import { IAkashaError, RootComponentProps } from '@akashaproject/ui-awf-typings';
import { ILoginState } from '@akashaproject/ui-awf-hooks/lib/use-login-state';

const {
  Box,
  MainAreaCardBox,
  EntryBox,
  VirtualList,
  Helmet,
  CommentEditor,
  EditorPlaceholder,
  EntryCardHidden,
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

  const [postsState, postsActions] = usePosts({
    user: loginState.ethAddress,
    onError: errorActions.createError,
  });

  const [mentionsState, mentionsActions] = useMentions({
    onError: errorActions.createError,
  });

  const entryData = React.useMemo(() => {
    if (postId && postsState.postsData[postId]) {
      return postsState.postsData[postId];
    }
    return null;
  }, [postId, postsState.postsData[postId]]);

  const locale = (i18n.languages[0] || 'en') as ILocale;

  const [loginProfile, loginProfileActions] = useProfile({
    onError: errorActions.createError,
  });

  React.useEffect(() => {
    if (loginState.pubKey) {
      loginProfileActions.getProfileData({ pubKey: loginState.pubKey });
    }
  }, [loginState.pubKey]);

  const [bookmarkState, bookmarkActions] = useBookmarks({
    onError: errorActions.createError,
  });

  const [followedProfiles, followActions] = useFollow({
    onError: errorActions.createError,
  });

  React.useEffect(() => {
    if (loginState.ethAddress && entryData?.author.ethAddress) {
      followActions.isFollowing(loginState.ethAddress, entryData.author.ethAddress);
    }
  }, [loginState.ethAddress, entryData?.author.ethAddress]);

  const handleFollow = () => {
    if (entryData?.author.ethAddress) {
      followActions.follow(entryData?.author.ethAddress);
    }
  };

  const handleUnfollow = () => {
    if (entryData.author.ethAddress) {
      followActions.unfollow(entryData?.author.ethAddress);
    }
  };

  const isFollowing = followedProfiles.includes(entryData?.author?.ethAddress);

  const handleLoadMore = async (payload: any) => {
    const req: { limit: number; offset?: string; postID: string } = {
      limit: payload.limit,
      postID: postId,
    };
    if (!postsState.isFetchingComments) {
      postsActions.getComments(req);
    }
  };

  const loadItemData = async (payload: ILoadItemDataPayload) => {
    postsActions.getComment(payload.itemId);
  };

  React.useEffect(() => {
    // this is used to initialise comments when navigating to other post ids
    if (postId && loginState.currentUserCalled) {
      postsActions.getPost(postId);
      handleLoadMore({ limit: 5, postID: postId });
      if (loginState.ethAddress) {
        bookmarkActions.getBookmarks();
      }
    }
  }, [postId, loginState.currentUserCalled, loginState.ethAddress]);

  const bookmarked = React.useMemo(() => {
    if (
      !bookmarkState.isFetching &&
      bookmarkState.bookmarks.findIndex(bm => bm.entryId === postId) >= 0
    ) {
      return true;
    }
    return false;
  }, [bookmarkState]);

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
    if (bookmarkState.bookmarks.findIndex(bm => bm.entryId === entryId) >= 0) {
      return bookmarkActions.removeBookmark(entryId);
    }
    return bookmarkActions.bookmarkPost(entryId);
  };

  const handleCommentBookmark = (commentId: string) => {
    if (!loginState.ethAddress) {
      return showLoginModal();
    }
    if (bookmarkState.bookmarks.findIndex(bm => bm.entryId === commentId) >= 0) {
      return bookmarkActions.removeBookmark(commentId);
    }
    return bookmarkActions.bookmarkComment(commentId);
  };

  const handleCommentRepost = () => {
    // todo
  };

  const handleEntryFlag = (entryId: string, contentType: string) => () => {
    props.navigateToModal({ name: 'report-modal', entryId, contentType });
  };

  const handlePublishComment = async (data: {
    metadata: {
      app: string;
      version: number;
      quote?: string;
      tags: string[];
      mentions: string[];
    };
    author: string;
    content: any;
    textContent: any;
  }) => {
    if (!loginState.ethAddress) {
      showLoginModal();
      return;
    }
    postsActions.optimisticPublishComment(data, postId, loginProfile);
  };

  const handleRepost = (_withComment: boolean, entryData: any) => {
    props.navigateToModal({ name: 'editor', embedEntry: entryData });
  };

  const handleNavigateToPost = redirectToPost(navigateToUrl, postId, postsActions.resetPostIds);

  const handleSingleSpaNavigate = redirect(navigateToUrl, postsActions.resetPostIds);

  const onUploadRequest = uploadMediaToTextile;

  const handleFlipCard = (entry: any, isQuote: boolean) => () => {
    // modify entry or its quote (if applicable)
    const modifiedEntry = isQuote
      ? { ...entry, quote: { ...entry.quote, reported: false } }
      : { ...entry, reported: false };
    postsActions.updatePostsState(modifiedEntry);
  };

  const handleListFlipCard = (entry: any, isQuote: boolean) => () => {
    const modifiedEntry = isQuote
      ? { ...entry, quote: { ...entry.quote, reported: false } }
      : { ...entry, reported: false };
    postsActions.updatePostsState(modifiedEntry);
  };

  if (postsState.delistedItems.includes(postId)) {
    return (
      <EntryCardHidden
        moderatedContentLabel={t('This content has been moderated')}
        isDelisted={true}
      />
    );
  }

  if (!postsState.delistedItems.includes(postId) && postsState.reportedItems.includes(postId)) {
    return (
      <EntryCardHidden
        awaitingModerationLabel={t('You have reported this content. It is awaiting moderation.')}
        ctaLabel={t('See it anyway')}
        handleFlipCard={handleFlipCard(entryData, false)}
      />
    );
  }

  const postErrors = errorActions.getFilteredErrors('usePost.getPost');
  const commentErrors = errorActions.getFilteredErrors('usePosts.getComments');

  const entryAuthorName =
    entryData?.author?.name || entryData?.author?.userName || entryData?.author?.ethAddress;

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
                  details={t('An unexpected error occured! Please try to refresh the page')}
                  devDetails={errorMessages}
                />
              )}
              {!hasCriticalErrors && (
                <>
                  {!entryData && (
                    <EntryCardLoading
                      style={{ background: 'transparent', boxShadow: 'none', border: 0 }}
                    />
                  )}
                  {entryData && (
                    <EntryBox
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
            avatar={loginProfile.avatar}
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
                items={postsState.commentIds}
                itemsData={postsState.postsData}
                loadMore={handleLoadMore}
                loadItemData={loadItemData}
                hasMoreItems={!!postsState.nextCommentIndex}
                itemCard={
                  <PostRenderer
                    logger={logger}
                    bookmarkState={bookmarkState}
                    ethAddress={loginState.ethAddress}
                    locale={locale}
                    onBookmark={handleCommentBookmark}
                    onNavigate={handleNavigateToPost}
                    sharePostUrl={`${window.location.origin}${routes[POST]}/`}
                    onFlag={handleEntryFlag}
                    onRepost={handleCommentRepost}
                    onAvatarClick={handleAvatarClick}
                    onMentionClick={handleMentionClick}
                    onTagClick={handleTagClick}
                    singleSpaNavigate={handleSingleSpaNavigate}
                    handleFlipCard={handleListFlipCard}
                  />
                }
                customEntities={getPendingComments({
                  logger,
                  locale,
                  isMobile,
                  feedItems: postsState.postIds,
                  loggedEthAddress: loginState.ethAddress,
                  pendingComments: postsState.pendingComments,
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

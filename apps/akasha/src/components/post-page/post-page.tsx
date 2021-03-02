import * as React from 'react';
import { useParams } from 'react-router-dom';
import DS from '@akashaproject/design-system';
import { ILoadItemDataPayload } from '@akashaproject/design-system/lib/components/VirtualList/interfaces';
import {
  constants,
  usePosts,
  useBookmarks,
  useProfile,
  useFollow,
  useErrors,
} from '@akashaproject/ui-awf-hooks';
import { useTranslation } from 'react-i18next';
import { ILocale } from '@akashaproject/design-system/lib/utils/time';
import { uploadMediaToTextile } from '../../services/posting-service';
import { redirectToPost } from '../../services/routing-service';
import PostRenderer from './post-renderer';
import { getPendingComments } from './post-page-pending-comments';
import routes, { POST } from '../../routes';
import { IAkashaError, RootComponentProps } from '@akashaproject/ui-awf-typings';

const {
  Box,
  MainAreaCardBox,
  EntryBox,
  ReportModal,
  ToastProvider,
  ModalRenderer,
  useViewportSize,
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
  ethAddress: string | null;
  currentUserCalled: boolean;
  pubKey: string | null;
  flagged: string;
  reportModalOpen: boolean;
  setFlagged: React.Dispatch<React.SetStateAction<string>>;
  setReportModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  showLoginModal: () => void;
  navigateToUrl: (path: string) => void;
  isMobile: boolean;
  onError: (err: IAkashaError) => void;
}

const PostPage: React.FC<IPostPage & RootComponentProps> = props => {
  const {
    sdkModules,
    globalChannel,
    flagged,
    reportModalOpen,
    currentUserCalled,
    setFlagged,
    setReportModalOpen,
    showLoginModal,
    logger,
    navigateToUrl,
    ethAddress,
    isMobile,
  } = props;

  const { postId } = useParams<{ userId: string; postId: string }>();
  const { t, i18n } = useTranslation();
  const [, errorActions] = useErrors({ logger });

  const [postsState, postsActions] = usePosts({
    user: ethAddress,
    postsService: sdkModules.posts,
    ipfsService: sdkModules.commons.ipfsService,
    onError: errorActions.createError,
  });

  const entryData = React.useMemo(() => {
    if (postId && postsState.postsData[postId]) {
      return postsState.postsData[postId];
    }
    return null;
  }, [postId, postsState.postsData[postId]]);

  const {
    size,
    dimensions: { width },
  } = useViewportSize();

  const locale = (i18n.languages[0] || 'en') as ILocale;

  const [loginProfile, loginProfileActions] = useProfile({
    profileService: props.sdkModules.profiles.profileService,
    ipfsService: props.sdkModules.commons.ipfsService,
    onError: errorActions.createError,
  });

  React.useEffect(() => {
    if (props.pubKey) {
      loginProfileActions.getProfileData({ pubKey: props.pubKey });
    }
  }, [props.pubKey]);

  const [bookmarkState, bookmarkActions] = useBookmarks({
    dbService: sdkModules.db,
    pubKey: props.pubKey,
    onError: errorActions.createError,
  });

  const [followedProfiles, followActions] = useFollow({
    globalChannel,
    profileService: sdkModules.profiles.profileService,
    onError: errorActions.createError,
  });

  React.useEffect(() => {
    if (ethAddress && entryData?.author.ethAddress) {
      followActions.isFollowing(ethAddress, entryData.author.ethAddress);
    }
  }, [ethAddress, entryData?.author.ethAddress]);

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
    if (postId && currentUserCalled) {
      postsActions.getPost(postId);
      handleLoadMore({ limit: 5, postID: postId });
    }
  }, [postId, currentUserCalled]);

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

  const handleAvatarClick = (ev: React.MouseEvent<HTMLDivElement>, pubKey: string) => {
    navigateToUrl(`/profile/${pubKey}`);
    ev.preventDefault();
  };

  const handleEntryBookmark = (entryId: string) => {
    if (!ethAddress) {
      return showLoginModal();
    }
    if (bookmarkState.bookmarks.findIndex(bm => bm.entryId === entryId) >= 0) {
      return bookmarkActions.removeBookmark(entryId);
    }
    return bookmarkActions.bookmarkPost(entryId);
  };

  const handleCommentBookmark = (commentId: string) => {
    if (!ethAddress) {
      return showLoginModal();
    }
    if (bookmarkState.bookmarks.findIndex(bm => bm.entryId === commentId) >= 0) {
      return bookmarkActions.removeBookmark(commentId);
    }
    return bookmarkActions.bookmarkComment(commentId);
  };

  const handleEntryRepost = () => {
    // todo
  };
  const handleEntryFlag = (entryId: string, user?: string | null) => () => {
    /* todo */
    if (!user) {
      setFlagged(entryId);
      return showLoginModal();
    }
    setFlagged(entryId);
    setReportModalOpen(true);
  };

  const handlePublish = async (data: {
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
    if (!ethAddress) {
      showLoginModal();
      return;
    }
    postsActions.optimisticPublishComment(data, postId, loginProfile);
  };

  const [tags, setTags] = React.useState([]);
  const handleGetTags = (query: string) => {
    const tagsService = sdkModules.posts.tags.searchTags({ tagName: query });
    tagsService.subscribe((resp: any) => {
      if (resp.data?.searchTags) {
        const filteredTags = resp.data.searchTags;
        setTags(filteredTags);
      }
    });
  };

  const [mentions, setMentions] = React.useState([]);
  const handleGetMentions = (query: string) => {
    const mentionsService = sdkModules.profiles.profileService.searchProfiles({
      name: query,
    });
    mentionsService.subscribe((resp: any) => {
      if (resp.data?.searchProfiles) {
        const filteredMentions = resp.data.searchProfiles;
        setMentions(filteredMentions);
      }
    });
  };

  const handleNavigateToPost = redirectToPost(navigateToUrl, postsActions.resetPostIds);

  const onUploadRequest = uploadMediaToTextile(
    sdkModules.profiles.profileService,
    sdkModules.commons.ipfsService,
  );

  const handleFlipCard = (entry: any, isQuote: boolean) => () => {
    // modify entry or its quote (if applicable)
    const modifiedEntry = isQuote
      ? { ...entry, quote: { ...entry.quote, reported: false } }
      : { ...entry, reported: false };
    postsActions.updatePostsState(modifiedEntry);
  };

  const updateEntry = (entryId: string) => {
    const modifiedEntry = { ...postsState.postsData[entryId], reported: true };
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
        awaitingModerationLabel={t('You have reported this post. It is awaiting moderation.')}
        ctaLabel={t('See it anyway')}
        handleFlipCard={handleFlipCard(entryData, false)}
      />
    );
  }

  const postErrors = errorActions.getFilteredErrors('usePost.getPost');
  const commentErrors = errorActions.getFilteredErrors('usePosts.getComments');

  return (
    <MainAreaCardBox style={{ height: 'auto' }}>
      <Helmet>
        <title>AKASHA Post | Ethereum.world</title>
      </Helmet>
      <ModalRenderer slotId={props.layout.app.modalSlotId}>
        {reportModalOpen && (
          <ToastProvider autoDismiss={true} autoDismissTimeout={5000}>
            <ReportModal
              titleLabel={t('Report a Post')}
              successTitleLabel={t('Thank you for helping us keep Ethereum World safe! 🙌')}
              successMessageLabel={t('We will investigate this post and take appropriate action.')}
              optionsTitleLabel={t('Please select a reason')}
              optionLabels={[
                t('Suspicious, deceptive, or spam'),
                t('Abusive or harmful to others'),
                t('Self-harm or suicide'),
                t('Illegal'),
                t('Nudity'),
                t('Violence'),
              ]}
              descriptionLabel={t('Explanation')}
              descriptionPlaceholder={t('Please explain your reason(s)')}
              footerText1Label={t('If you are unsure, you can refer to our')}
              footerLink1Label={t('Code of Conduct')}
              footerUrl1={'https://akasha.slab.com/public/ethereum-world-code-of-conduct-e7ejzqoo'}
              footerText2Label={t('and')}
              footerLink2Label={t('Terms of Service')}
              footerUrl2={'https://ethereum.world/terms-of-service'}
              cancelLabel={t('Cancel')}
              reportLabel={t('Report')}
              blockLabel={t('Block User')}
              closeLabel={t('Close')}
              user={ethAddress ? ethAddress : ''}
              contentId={flagged}
              contentType="post"
              baseUrl={constants.BASE_FLAG_URL}
              size={size}
              width={width}
              updateEntry={updateEntry}
              closeModal={() => {
                setReportModalOpen(false);
              }}
            />
          </ToastProvider>
        )}
      </ModalRenderer>
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
                      loggedProfileEthAddress={ethAddress}
                      locale={locale}
                      bookmarkLabel={t('Save')}
                      bookmarkedLabel={t('Saved')}
                      onRepost={() => {
                        return;
                      }}
                      onEntryFlag={handleEntryFlag(entryData.entryId, ethAddress)}
                      handleFollowAuthor={handleFollow}
                      handleUnfollowAuthor={handleUnfollow}
                      isFollowingAuthor={isFollowing}
                      onContentClick={handleNavigateToPost}
                      onMentionClick={handleMentionClick}
                      awaitingModerationLabel={t(
                        'You have reported this post. It is awaiting moderation.',
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
      {!ethAddress && (
        <Box margin="medium">
          <EditorPlaceholder onClick={showLoginModal} ethAddress={null} />
        </Box>
      )}
      {ethAddress && (
        <Box margin="medium">
          <CommentEditor
            avatar={loginProfile.avatar}
            ethAddress={ethAddress}
            postLabel={t('Reply')}
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
                    sdkModules={sdkModules}
                    logger={logger}
                    globalChannel={globalChannel}
                    bookmarkState={bookmarkState}
                    ethAddress={ethAddress}
                    locale={locale}
                    onBookmark={handleCommentBookmark}
                    onNavigate={handleNavigateToPost}
                    sharePostUrl={`${window.location.origin}${routes[POST]}/`}
                    onFlag={handleEntryFlag}
                    onRepost={handleEntryRepost}
                    onAvatarClick={handleAvatarClick}
                    onMentionClick={handleMentionClick}
                    handleFlipCard={handleListFlipCard}
                  />
                }
                customEntities={getPendingComments({
                  logger,
                  globalChannel,
                  locale,
                  isMobile,
                  sdkModules,
                  feedItems: postsState.postIds,
                  loggedEthAddress: ethAddress,
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

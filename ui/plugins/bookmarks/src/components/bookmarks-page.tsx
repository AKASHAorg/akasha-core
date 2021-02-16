import * as React from 'react';
import DS from '@akashaproject/design-system';
import { RootComponentProps } from '@akashaproject/ui-awf-typings';
import {
  useBookmarks,
  BookmarkTypes,
  useLoginState,
  useErrors,
  usePosts,
} from '@akashaproject/ui-awf-hooks';
import { useTranslation } from 'react-i18next';
import EntryCardRenderer from './entry-renderer';

const { VirtualList, ErrorInfoCard, ErrorLoader, Spinner } = DS;

const BookmarksPage = (props: RootComponentProps) => {
  const { globalChannel, sdkModules, logger } = props;

  const { t } = useTranslation();

  const [errorState, errorActions] = useErrors({ logger });

  const [loginState] = useLoginState({
    globalChannel: globalChannel,
    onError: errorActions.createError,
    authService: sdkModules.auth.authService,
    ipfsService: sdkModules.commons.ipfsService,
    profileService: sdkModules.profiles.profileService,
    onLogout: () => props.singleSpa.navigateToUrl('/'),
  });
  const [bookmarkState, bookmarkActions] = useBookmarks({
    ethAddress: loginState.ethAddress,
    dbService: sdkModules.db,
    onError: errorActions.createError,
  });

  const [postState, postActions] = usePosts({
    logger,
    user: loginState.ethAddress,
    postsService: sdkModules.posts,
    ipfsService: sdkModules.commons.ipfsService,
    onError: errorActions.createError,
  });
  React.useEffect(() => {
    if (bookmarkState.bookmarks.length) {
      bookmarkState.bookmarks.forEach(bookmark => {
        switch (bookmark.type) {
          case BookmarkTypes.POST:
            postActions.getPost(bookmark.entryId);
            break;
          case BookmarkTypes.COMMENT:
            postActions.getComment(bookmark.entryId);
            break;
          default:
            if (logger) {
              logger.error('Bookmark type is undefined!');
            }
            break;
        }
      });
    }
  }, [bookmarkState.bookmarks.length]);

  const handleBookmarkClick = (entryId: string) => {
    if (bookmarkState.bookmarks.findIndex(bm => bm.entryId === entryId) >= 0) {
      return bookmarkActions.removeBookmark(entryId);
    }
  };

  const handleMentionClick = (profileEthAddress: string) => {
    props.singleSpa.navigateToUrl(`/profile/${profileEthAddress}`);
  };

  const handleAvatarClick = (ev: React.MouseEvent<HTMLDivElement>, authorEth: string) => {
    props.singleSpa.navigateToUrl(`/profile/${authorEth}`);
    ev.preventDefault();
  };

  const redirectToPost = (navigateToUrl: (path: string) => void) => (details: {
    authorEthAddress: string;
    entryId: string;
    replyTo: {
      authorEthAddress: string;
      entryId: string;
    } | null;
  }) => {
    const { entryId, replyTo } = details;
    let url = `/AKASHA-app/post/${entryId}`;
    if (replyTo && replyTo.entryId) {
      // handle the reply
      url = `/AKASHA-app/post/${replyTo.entryId}`;
    }
    navigateToUrl(url);
  };

  const handleEntryShare = (
    service: 'twitter' | 'facebook' | 'reddit' | 'copy',
    entryId: string,
  ) => {
    const bookmark = bookmarkState.bookmarks.find(bm => bm.entryId === entryId);
    let resourceName;
    switch (bookmark?.type) {
      case BookmarkTypes.POST:
        resourceName = 'post';
        break;
      case BookmarkTypes.COMMENT:
        resourceName = 'comment';
        break;
      default:
        resourceName = 'unknown';
        break;
    }
    const url = `${window.location.origin}/AKASHA-app/${resourceName}/${entryId}`;
    let shareUrl;
    switch (service) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${url}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case 'reddit':
        shareUrl = `http://www.reddit.com/submit?url=${url}`;
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        break;
      default:
        break;
    }
    window.open(shareUrl, '_blank');
  };

  const handleNavigateToPost = redirectToPost(props.singleSpa.navigateToUrl);

  const handleFlipCard = (entry: any) => () => {
    const modifiedEntry = { ...entry, reported: false };
    postActions.updatePostsState(modifiedEntry);
  };

  return (
    <>
      <ErrorInfoCard errors={errorState}>
        {(messages, hasCritical) => (
          <>
            {messages && (
              <ErrorLoader
                type="script-error"
                title={t('There was an error loading the entry')}
                details={messages}
              />
            )}
            {!hasCritical && (
              <>
                {bookmarkState.isFetching && <Spinner />}
                {!bookmarkState.isFetching && !bookmarkState.bookmarks.length && (
                  <ErrorLoader
                    type="missing-saved-items"
                    title={t('Save what inspires you')}
                    details={t(`You have not saved any posts yet\.
                      Once you start doing so, they will be found here\.`)}
                  />
                )}
                {!bookmarkState.isFetching && (
                  <VirtualList
                    items={bookmarkState.bookmarks.map(bm => bm.entryId)}
                    itemsData={postState.postsData}
                    loadMore={() => false}
                    itemCard={
                      <EntryCardRenderer
                        logger={logger}
                        globalChannel={globalChannel}
                        sdkModules={sdkModules}
                        bookmarkState={bookmarkState}
                        ethAddress={loginState.ethAddress}
                        onBookmark={handleBookmarkClick}
                        onNavigate={handleNavigateToPost}
                        onRepliesClick={handleNavigateToPost}
                        onRepost={() => false}
                        onShare={handleEntryShare}
                        onAvatarClick={handleAvatarClick}
                        onMentionClick={handleMentionClick}
                        contentClickable={true}
                        disableReposting={true}
                        awaitingModerationLabel={t(
                          'You have reported this post. It is awaiting moderation.',
                        )}
                        moderatedContentLabel={t('This content has been moderated')}
                        ctaLabel={t('See it anyway')}
                        handleFlipCard={handleFlipCard}
                      />
                    }
                  />
                )}
              </>
            )}
          </>
        )}
      </ErrorInfoCard>
    </>
  );
};

export default BookmarksPage;

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

type BookmarksPageProps = Omit<
  RootComponentProps,
  | 'layout'
  | 'getMenuItems'
  | 'events'
  | 'domElement'
  | 'domElement'
  | 'name'
  | 'unmountSelf'
  | 'activeWhen'
  | 'rootNodeId'
>;

const BookmarksPage: React.FC<BookmarksPageProps> = props => {
  const { globalChannel, sdkModules, singleSpa, logger, rxjsOperators } = props;
  const { t } = useTranslation();

  const [errorState, errorActions] = useErrors({ logger });

  const [loginState] = useLoginState({
    rxjsOperators,
    globalChannel: globalChannel,
    onError: errorActions.createError,
    authService: sdkModules.auth.authService,
    ipfsService: sdkModules.commons.ipfsService,
    profileService: sdkModules.profiles.profileService,
    onLogout: () => props.singleSpa.navigateToUrl('/'),
  });
  const [bookmarkState, bookmarkActions] = useBookmarks({
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
    if (loginState.waitForAuth && !loginState.ready) {
      return;
    }
    if (
      (loginState.waitForAuth && loginState.ready) ||
      (loginState.currentUserCalled && loginState.ethAddress)
    ) {
      bookmarkActions.getBookmarks();
    }
  }, [JSON.stringify(loginState)]);

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

  const handleTagClick = (name: string) => {
    props.singleSpa.navigateToUrl(`/social-app/tags/${name}`);
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
    let url = `/social-app/post/${entryId}`;
    if (replyTo && replyTo.entryId) {
      // handle the reply
      url = `/social-app/post/${replyTo.entryId}`;
    }
    navigateToUrl(url);
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
                    details={t(`You have not saved any posts yet.
                      Once you start doing so, they will be found here.`)}
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
                        singleSpa={singleSpa}
                        rxjsOperators={rxjsOperators}
                        bookmarkState={bookmarkState}
                        ethAddress={loginState.ethAddress}
                        onBookmark={handleBookmarkClick}
                        onNavigate={handleNavigateToPost}
                        onRepost={() => false}
                        onAvatarClick={handleAvatarClick}
                        onMentionClick={handleMentionClick}
                        onTagClick={handleTagClick}
                        contentClickable={true}
                        disableReposting={true}
                        sharePostUrl={`${window.location.origin}/social-app/post/`}
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

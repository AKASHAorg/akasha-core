import * as React from 'react';
import DS from '@akashaproject/design-system';
import { RootComponentProps } from '@akashaproject/ui-awf-typings';
import { BookmarkTypes, useLoginState, useErrors, usePosts } from '@akashaproject/ui-awf-hooks';
import {
  useGetBookmarks,
  useBookmarkDelete,
} from '@akashaproject/ui-awf-hooks/lib/use-bookmarks.new';
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
  const { singleSpa, logger } = props;
  const { t } = useTranslation();

  const [errorState, errorActions] = useErrors({ logger });

  const [loginState] = useLoginState({
    onError: errorActions.createError,
    onLogout: () => props.singleSpa.navigateToUrl('/'),
  });

  const bookmarksReq = useGetBookmarks(loginState.ready?.ethAddress);
  const bookmarks = bookmarksReq.data;
  const deleteBookmark = useBookmarkDelete();

  const [postState, postActions] = usePosts({
    logger,
    user: loginState.ethAddress,
    onError: errorActions.createError,
  });

  // React.useEffect(() => {
  //   if (loginState.waitForAuth && !loginState.ready) {
  //     return;
  //   }
  //   if (
  //     (loginState.waitForAuth && loginState.ready) ||
  //     (loginState.currentUserCalled && loginState.ethAddress)
  //   ) {
  //     bookmarkActions.getBookmarks();
  //   }
  // }, [JSON.stringify(loginState)]);

  React.useEffect(() => {
    if (bookmarks.length) {
      bookmarks.forEach(bookmark => {
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
  }, [bookmarks.length]);

  const handleBookmarkClick = (entryId: string) => {
    if (bookmarks.findIndex(bm => bm.entryId === entryId) >= 0) {
      deleteBookmark.mutate(entryId);
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

  const redirectToPost =
    (navigateToUrl: (path: string) => void) =>
    (details: {
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
                {bookmarksReq.isFetching && <Spinner />}
                {!bookmarksReq.isFetching && !bookmarks.length && (
                  <ErrorLoader
                    type="missing-saved-items"
                    title={t('Save what inspires you')}
                    details={t(`You have not saved any posts yet.
                      Once you start doing so, they will be found here.`)}
                  />
                )}
                {!bookmarksReq.isFetching && (
                  <VirtualList
                    items={bookmarks.map(bm => bm.entryId)}
                    itemsData={postState.postsData}
                    loadMore={() => false}
                    itemCard={
                      <EntryCardRenderer
                        logger={logger}
                        singleSpa={singleSpa}
                        bookmarkState={bookmarksReq}
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
                          'You have reported this content. It is awaiting moderation.',
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

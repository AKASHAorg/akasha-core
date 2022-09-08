import * as React from 'react';
import DS from '@akashaorg/design-system';
import FeedWidget from '@akashaorg/ui-lib-feed/lib/components/App';
import { RootComponentProps, EntityTypes, ModalNavigationOptions } from '@akashaorg/typings/ui';
import {
  useGetBookmarks,
  useGetLogin,
  useGetProfile,
  checkPostActive,
  usePosts,
  mapEntry,
} from '@akashaorg/ui-awf-hooks';
import { useTranslation } from 'react-i18next';

const { ErrorLoader, Spinner, StartCard, InfoCard, Box } = DS;

type BookmarksPageProps = Omit<
  RootComponentProps,
  'layout' | 'events' | 'domElement' | 'name' | 'unmountSelf' | 'activeWhen' | 'rootNodeId'
>;

const BookmarksPage: React.FC<BookmarksPageProps> = props => {
  const { t } = useTranslation();

  const loginQuery = useGetLogin();
  const loggedProfileQuery = useGetProfile(loginQuery.data?.pubKey);

  const isLoggedIn = React.useMemo(() => {
    return loginQuery.data?.ethAddress;
  }, [loginQuery.data?.ethAddress]);

  const bookmarksReq = useGetBookmarks(loginQuery.data?.isReady && isLoggedIn);
  const bookmarks = bookmarksReq.data;

  const bookmarkedPostIds = bookmarks.map((bm: Record<string, unknown>) => bm.entryId);
  const bookmarkedPosts = usePosts({ postIds: bookmarkedPostIds, enabler: true });
  const numberOfBookmarkedInactivePosts = React.useMemo(
    () =>
      bookmarkedPosts.filter(({ data }) => (data ? !checkPostActive(mapEntry(data)) : false))
        .length,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [bookmarkedPostIds],
  );

  const showLoginModal = (redirectTo?: { modal: ModalNavigationOptions }) => {
    props.navigateToModal({ name: 'login', redirectTo });
  };

  const handleEntryFlag = (entryId: string, itemType: string) => () => {
    if (!loginQuery.data?.pubKey) {
      return showLoginModal({ modal: { name: 'report-modal', entryId, itemType } });
    }
    props.navigateToModal({ name: 'report-modal', entryId, itemType });
  };

  const handleEntryRemove = (entryId: string) => {
    props.navigateToModal({
      name: 'entry-remove-confirmation',
      entryId,
      entryType: EntityTypes.ENTRY,
    });
  };

  const description = t(
    'Bookmarks help you save your favorite posts for quick access at any time.',
  );

  const getInactivePostsText = (numberOfBookmarkedInactivePosts: number) => {
    const result = numberOfBookmarkedInactivePosts
      ? t('{{ deletedCount }} of which {{ linkingVerb }} deleted', {
          deletedCount: numberOfBookmarkedInactivePosts,
          linkingVerb: numberOfBookmarkedInactivePosts > 1 ? t('are') : t('is'),
        })
      : '';
    return result ? ` (${result})` : '';
  };

  const getSubtitleText = () => {
    if (isLoggedIn && bookmarks?.length) {
      return t('You have {{ bookmarkCount }} bookmarks.{{ inactivePostsText }}', {
        bookmarkCount: bookmarks.length,
        inactivePostsText: getInactivePostsText(numberOfBookmarkedInactivePosts),
      });
    }
    if (isLoggedIn && !bookmarks?.length) {
      return description;
    }
    return t('Check out the posts saved in your bookmarks');
  };

  return (
    <>
      {bookmarksReq.status === 'error' && (
        <ErrorLoader
          type="script-error"
          title={t('There was an error loading the bookmarks')}
          details={bookmarksReq.error}
        />
      )}
      {bookmarksReq.status !== 'error' && (
        <Box gap="medium">
          <StartCard
            title={t('Bookmarks')}
            subtitle={getSubtitleText()}
            heading={t('✨ Save what inspires you ✨')}
            description={description}
            image={'/images/no-bookmarks.png'}
            showMainArea={!isLoggedIn}
          />
          {!bookmarksReq.isFetched && isLoggedIn && <Spinner />}
          {bookmarksReq.isFetched && (!bookmarks || !bookmarks.length) && (
            <InfoCard
              icon="bookmark"
              title={t('No bookmarks yet 🔖')}
              suggestion={t(
                'When you bookmark things, you’ll find them waiting patiently for you here.',
              )}
            />
          )}
          {bookmarksReq.status === 'success' && bookmarks && (
            <FeedWidget
              modalSlotId={props.layoutConfig.modalSlotId}
              itemType={EntityTypes.ENTRY}
              logger={props.logger}
              onLoadMore={() => {
                /* if next page, load more */
              }}
              getShareUrl={(itemId: string) =>
                `${window.location.origin}/@akashaorg/app-akasha-integration/post/${itemId}`
              }
              pages={[{ results: bookmarkedPostIds }]}
              requestStatus={bookmarksReq.status}
              loginState={loginQuery.data}
              loggedProfile={loggedProfileQuery.data}
              navigateTo={props.plugins?.routing?.navigateTo}
              navigateToModal={props.navigateToModal}
              onLoginModalOpen={showLoginModal}
              hasNextPage={false}
              contentClickable={true}
              onEntryFlag={handleEntryFlag}
              onEntryRemove={handleEntryRemove}
              removeEntryLabel={t('Delete Post')}
              removedByMeLabel={t('You deleted this post')}
              removedByAuthorLabel={t('This post was deleted by its author')}
              uiEvents={props.uiEvents}
              itemSpacing={8}
              i18n={props.plugins?.translation?.i18n}
            />
          )}
        </Box>
      )}
    </>
  );
};

export default BookmarksPage;

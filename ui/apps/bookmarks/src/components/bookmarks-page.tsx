import React from 'react';
import { useTranslation } from 'react-i18next';

import DS from '@akashaorg/design-system';
import ErrorLoader from '@akashaorg/design-system-core/lib/components/ErrorLoader';
import { RootComponentProps, EntityTypes, ModalNavigationOptions } from '@akashaorg/typings/ui';
import FeedWidget from '@akashaorg/ui-lib-feed/lib/components/App';
import {
  useGetBookmarks,
  useGetLogin,
  useGetProfile,
  usePosts,
  checkEntryActive,
} from '@akashaorg/ui-awf-hooks';

const { Spinner, StartCard, InfoCard, Box } = DS;

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
  /**
   * Currently react query's initialData isn't working properly so bookmarksReq.data will return undefined even if we supply initialData.
   * This will be fixed in v4 of react query(https://github.com/DamianOsipiuk/vue-query/issues/124).
   * In the mean time, the following check will ensure undefined data is handled.  */
  const bookmarks = bookmarksReq.data || [];

  const bookmarkedPostIds = bookmarks.map((bm: Record<string, string>) => bm.itemId);
  const bookmarkedPosts = usePosts({ postIds: bookmarkedPostIds, enabler: true });
  const numberOfBookmarkedInactivePosts = React.useMemo(
    () => bookmarkedPosts.filter(({ data }) => (data ? !checkEntryActive(data) : false)).length,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [bookmarkedPostIds],
  );

  const showLoginModal = (redirectTo?: { modal: ModalNavigationOptions }) => {
    props.navigateToModal({ name: 'login', redirectTo });
  };

  const handleEntryFlag = (itemId: string, itemType: EntityTypes) => () => {
    if (!loginQuery.data?.pubKey) {
      return showLoginModal({ modal: { name: 'report-modal', itemId, itemType } });
    }
    props.navigateToModal({ name: 'report-modal', itemId, itemType });
  };

  const handleEntryRemove = (itemId: string) => {
    props.navigateToModal({
      name: 'entry-remove-confirmation',
      itemId,
      itemType: EntityTypes.POST,
    });
  };

  const description = t(
    'Bookmarks help you save your favorite posts for quick access at any time.',
  );

  const getInactivePostsText = (numberOfBookmarkedInactivePosts: number) => {
    const linkingVerb = numberOfBookmarkedInactivePosts > 1 ? t('are') : t('is');
    const result = numberOfBookmarkedInactivePosts
      ? t('{{ deletedCount }} of which {{ linkingVerb }} deleted', {
          deletedCount: numberOfBookmarkedInactivePosts,
          linkingVerb,
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
          details={bookmarksReq.error as string}
        />
      )}
      {bookmarksReq.status !== 'error' && (
        <Box data-testid="bookmarks" gap="medium">
          <StartCard
            title={t('Bookmarks')}
            subtitle={getSubtitleText()}
            heading={t('✨ Save what inspires you ✨')}
            description={description}
            image={'/images/no-saved-posts-error.webp'}
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
          {bookmarksReq.status === 'success' && bookmarks.length > 0 && (
            <FeedWidget
              modalSlotId={props.layoutConfig.modalSlotId}
              itemType={EntityTypes.POST}
              logger={props.logger}
              onLoadMore={() => {
                /* if next page, load more */
              }}
              getShareUrl={(itemId: string) =>
                `${window.location.origin}/@akashaorg/app-akasha-integration/post/${itemId}`
              }
              pages={[{ results: bookmarkedPostIds, total: bookmarkedPostIds.length }]}
              requestStatus={bookmarksReq.status}
              loginState={loginQuery.data}
              loggedProfile={loggedProfileQuery.data}
              navigateTo={props.plugins['@akashaorg/app-routing']?.routing?.navigateTo}
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
              i18n={props.plugins['@akashaorg/app-translation']?.translation?.i18n}
            />
          )}
        </Box>
      )}
    </>
  );
};

export default BookmarksPage;

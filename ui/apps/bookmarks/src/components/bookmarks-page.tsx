import * as React from 'react';

import DS from '@akashaorg/design-system';
import FeedWidget from '@akashaorg/ui-lib-feed/lib/components/App';
import { RootComponentProps } from '@akashaorg/ui-awf-typings';
import { ItemTypes, ModalNavigationOptions } from '@akashaorg/ui-awf-typings/lib/app-loader';
import { useGetBookmarks, useGetLogin, useGetProfile } from '@akashaorg/ui-awf-hooks';
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
      entryType: ItemTypes.ENTRY,
    });
  };

  const description = t('Mark your favourite posts, you can find them here anytime.');

  const getSubtitleText = () => {
    if (isLoggedIn && bookmarks?.length) {
      return t(
        'There {{ verb }} {{ bookmarkCount }} {{ grammaticalPost }} saved in your bookmarks.',
        {
          verb: bookmarks.length === 1 ? 'is' : 'are',
          bookmarkCount: bookmarks.length,
          grammaticalPost: bookmarks.length === 1 ? 'post' : 'posts',
        },
      );
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
              title={t('No bookmarks saved 🔖')}
              suggestion={t(
                'You have not saved any posts yet. Once you start doing so, they will be found here.',
              )}
            />
          )}
          {bookmarksReq.status === 'success' && bookmarks && (
            <FeedWidget
              modalSlotId={props.layoutConfig.modalSlotId}
              itemType={ItemTypes.ENTRY}
              logger={props.logger}
              onLoadMore={() => {
                /* if next page, load more */
              }}
              getShareUrl={(itemId: string) =>
                `${window.location.origin}/social-app/post/${itemId}`
              }
              pages={[{ results: [...bookmarks.map((bm: Record<string, unknown>) => bm.entryId)] }]}
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

import * as React from 'react';

import DS from '@akashaproject/design-system';
import FeedWidget from '@akashaproject/ui-lib-feed/lib/components/App';
import { RootComponentProps } from '@akashaproject/ui-awf-typings';
import { ItemTypes, ModalNavigationOptions } from '@akashaproject/ui-awf-typings/lib/app-loader';
import { useGetBookmarks, useGetLogin, useGetProfile } from '@akashaproject/ui-awf-hooks';
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

  const bookmarksReq = useGetBookmarks(loginQuery.data?.isReady && loginQuery.data?.ethAddress);
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
    if (loginQuery.data?.ethAddress && bookmarks?.length) {
      return t(
        'There {{ verb }} {{ bookmarkCount }} {{ grammaticalPost }} saved in your bookmarks.',
        {
          verb: bookmarks.length === 1 ? 'is' : 'are',
          bookmarkCount: bookmarks.length,
          grammaticalPost: bookmarks.length === 1 ? 'post' : 'posts',
        },
      );
    }
    if (loginQuery.data?.ethAddress && !bookmarks?.length) {
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
        <>
          <StartCard
            title={t('Bookmarks')}
            subtitle={getSubtitleText()}
            heading={t('✨ Save what inspires you ✨')}
            description={description}
            image={'/images/no-bookmarks.png'}
            loggedIn={loginQuery.isFetched && !!loginQuery.data?.ethAddress}
          />
          {!bookmarksReq.isFetched && loginQuery.data?.ethAddress && <Spinner />}
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
            <Box margin={{ horizontal: '0.5rem' }}>
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
                pages={[
                  { results: [...bookmarks.map((bm: Record<string, unknown>) => bm.entryId)] },
                ]}
                requestStatus={bookmarksReq.status}
                loginState={loginQuery.data}
                loggedProfile={loggedProfileQuery.data}
                singleSpaNavigate={props.singleSpa.navigateToUrl}
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
            </Box>
          )}
        </>
      )}
    </>
  );
};

export default BookmarksPage;

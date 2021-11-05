import * as React from 'react';
import DS from '@akashaproject/design-system';
import { RootComponentProps } from '@akashaproject/ui-awf-typings';
import { useGetBookmarks, useDeleteBookmark, useGetLogin } from '@akashaproject/ui-awf-hooks';
import { useTranslation } from 'react-i18next';
import EntryCardRenderer from './entry-renderer';
import { ItemTypes } from '@akashaproject/ui-awf-typings/lib/app-loader';
import { IContentClickDetails } from '@akashaproject/design-system/lib/components/EntryCard/entry-box';

const { ErrorLoader, Spinner, EntryList } = DS;

type BookmarksPageProps = Omit<
  RootComponentProps,
  | 'layout'
  | 'getMenuItems'
  | 'events'
  | 'domElement'
  | 'name'
  | 'unmountSelf'
  | 'activeWhen'
  | 'rootNodeId'
>;

const BookmarksPage: React.FC<BookmarksPageProps> = props => {
  const { singleSpa, logger } = props;
  const { t } = useTranslation();

  const loginQuery = useGetLogin();

  const bookmarksReq = useGetBookmarks(loginQuery.data?.isReady && loginQuery.data?.ethAddress);
  const bookmarks = bookmarksReq.data;
  const deleteBookmark = useDeleteBookmark();

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

  const handleNavigation = (itemType: ItemTypes, details: IContentClickDetails) => {
    let url;
    switch (itemType) {
      case ItemTypes.PROFILE:
        url = `/profile/${details.entryId}`;
        break;
      case ItemTypes.TAG:
        url = `/social-app/tags/${details.entryId}`;
        break;
      case ItemTypes.ENTRY:
        url = `/social-app/post/${details.entryId}`;
        break;
      default:
        break;
    }
    props.singleSpa.navigateToUrl(url);
  };

  const handleRepost = (_withComment: boolean, embedEntryId: string) => {
    if (!loginQuery.data?.ethAddress) {
      props.navigateToModal({ name: 'login' });
      return;
    } else {
      props.navigateToModal({ name: 'editor', embedEntry: embedEntryId });
    }
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
          {!bookmarksReq.isFetched && <Spinner />}
          {bookmarksReq.isFetched && (!bookmarks || !bookmarks.length) && (
            <ErrorLoader
              type="missing-saved-items"
              title={t('Save what inspires you')}
              details={t(`You have not saved any posts yet.
                  Once you start doing so, they will be found here.`)}
            />
          )}
          {bookmarksReq.status === 'success' && bookmarks && (
            <EntryList
              pages={[{ results: [...bookmarks.map(bm => bm.entryId)] }]}
              hasNextPage={false}
              onLoadMore={() => {
                /* ...nothing more to load */
              }}
              status={bookmarksReq.status}
              itemSpacing={8}
              itemCard={
                <EntryCardRenderer
                  modalSlotId={props.layoutConfig.modalSlotId}
                  logger={logger}
                  singleSpa={singleSpa}
                  bookmarks={bookmarksReq.data}
                  loginState={loginQuery.data}
                  onBookmark={handleBookmarkClick}
                  onNavigate={handleNavigation}
                  onRepost={handleRepost}
                  onAvatarClick={handleAvatarClick}
                  onMentionClick={handleMentionClick}
                  onTagClick={handleTagClick}
                  contentClickable={true}
                  disableReposting={true}
                  sharePostUrl={`${window.location.origin}/social-app/post/`}
                  moderatedContentLabel={t('This content has been moderated')}
                  ctaLabel={t('See it anyway')}
                  uiEvents={props.uiEvents}
                  navigateToModal={props.navigateToModal}
                />
              }
            />
          )}
        </>
      )}
    </>
  );
};

export default BookmarksPage;

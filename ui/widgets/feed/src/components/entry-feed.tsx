import * as React from 'react';
import DS from '@akashaproject/design-system';
import { IFeedWidgetProps } from './App';
import EntryRenderer from './entry-renderer';
import { ILocale } from '@akashaproject/design-system/lib/utils/time';
import {
  useSaveBookmark,
  useGetBookmarks,
  useDeleteBookmark,
} from '@akashaproject/ui-awf-hooks/lib/use-bookmarks.new';
import { ItemTypes } from '@akashaproject/ui-awf-typings/lib/app-loader';

const { EntryList } = DS;

const EntryFeed = (props: IFeedWidgetProps) => {
  const saveBookmarkQuery = useSaveBookmark();
  const delBookmarkQuery = useDeleteBookmark();
  const getBookmarksQuery = useGetBookmarks(props.loginState.ethAddress, props.loginState.isReady);

  const handleBookmark = (isBookmarked: boolean, entryId: string) => {
    if (props.loginState.isReady && props.loginState.pubKey) {
      if (!isBookmarked) {
        if (props.trackEvent) {
          props.trackEvent({
            category: 'Post',
            action: 'Bookmark',
          });
        }
        return saveBookmarkQuery.mutate({
          entryId,
          itemType: props.itemType,
        });
      }
      if (props.trackEvent) {
        props.trackEvent({
          category: 'Post',
          action: 'Remove Bookmark',
        });
      }
      return delBookmarkQuery.mutate(entryId);
    } else {
      props.onLoginModalOpen();
    }
  };
  const handleRepost = (_withComment: boolean, entryId: string) => {
    if (!props.loginState.pubKey) {
      props.onLoginModalOpen({ name: 'editor', embedEntry: entryId });
    } else {
      props.navigateToModal({ name: 'editor', embedEntry: entryId });
    }
  };

  return (
    <EntryList
      pages={props.pages}
      onLoadMore={props.onLoadMore}
      status={props.requestStatus}
      itemSpacing={props.itemSpacing}
      hasNextPage={props.hasNextPage}
      pageKeyPrefix={props.itemType === ItemTypes.ENTRY ? 'entry-page' : 'comment-page'}
      itemCard={
        <EntryRenderer
          modalSlotId={props.modalSlotId}
          loginState={props.loginState}
          itemType={props.itemType}
          sharePostUrl={`${window.location.origin}/social-app/post/`}
          locale={props.i18n.languages[0] as ILocale}
          bookmarksQuery={getBookmarksQuery}
          onBookmark={handleBookmark}
          onNavigate={props.onNavigate}
          singleSpaNavigate={props.singleSpaNavigate}
          onFlag={props.onEntryFlag}
          onRepost={handleRepost}
          parentIsProfilePage={props.parentIsProfilePage}
          contentClickable={props.contentClickable}
          onEntryRemove={props.onEntryRemove}
          removeEntryLabel={props.removeEntryLabel}
          removedByMeLabel={props.removedByMeLabel}
          removedByAuthorLabel={props.removedByAuthorLabel}
          uiEvents={props.uiEvents}
          trackEvent={props.trackEvent}
        />
      }
    />
  );
};

export default EntryFeed;

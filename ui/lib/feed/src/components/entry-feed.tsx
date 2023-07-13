import * as React from 'react';
import { ILocale } from '@akashaorg/design-system/src/utils/time';
import { useEntryNavigation } from '@akashaorg/ui-awf-hooks';
import { EntityTypes } from '@akashaorg/typings/ui';
import { FeedWidgetProps } from './app';
import EntryRenderer from './entry-renderer';
import EntryList from '@akashaorg/design-system-components/lib/components/EntryList';

const EntryFeed = (props: FeedWidgetProps) => {
  const {
    uiEvents,
    removedByAuthorLabel,
    removedByMeLabel,
    removeEntryLabel,
    onEntryRemove,
    contentClickable,
    parentIsProfilePage,
    onEntryFlag,
    modalSlotId,
    navigateTo,
    navigateToModal,
    i18n,
    loggedProfileData,
    viewAllEntry,
    itemType,
    hasNextPage,
    requestStatus,
    isFetchingNextPage,
    onLoadMore,
    pages,
    itemSpacing,
    trackEvent,
    accentBorderTop,
    replyFragmentItem,
    showReplyFragment,
    logger,
    onLoginModalOpen,
  } = props;
  const handleEntryNavigate = useEntryNavigation(navigateTo);

  const handleRepost = (_withComment: boolean, entryId: string) => {
    if (!loggedProfileData?.did.id) {
      navigateToModal({ name: 'login' });
    } else {
      navigateTo?.({
        appName: '@akashaorg/app-akasha-integration',
        getNavigationUrl: () => `/feed?repost=${entryId}`,
      });
    }
  };

  return (
    <EntryList
      onLoadMore={onLoadMore}
      requestStatus={requestStatus}
      isFetchingNextPage={isFetchingNextPage}
      pages={pages}
      itemSpacing={itemSpacing}
      hasNextPage={hasNextPage}
      pageKeyPrefix={itemType === EntityTypes.POST ? 'entry-page' : 'comment-page'}
      viewAllEntry={viewAllEntry}
      languageDirection={i18n?.dir() || 'ltr'}
      itemCard={
        <EntryRenderer
          modalSlotId={modalSlotId}
          itemType={itemType}
          sharePostUrl={`${window.location.origin}/@akashaorg/app-akasha-integration/post/`}
          locale={i18n?.languages[0] as ILocale}
          onEntryNavigate={handleEntryNavigate}
          navigateTo={navigateTo}
          onEntryFlag={onEntryFlag}
          onRepost={handleRepost}
          parentIsProfilePage={parentIsProfilePage}
          contentClickable={contentClickable}
          onEntryRemove={onEntryRemove}
          removeEntryLabel={removeEntryLabel}
          removedByMeLabel={removedByMeLabel}
          removedByAuthorLabel={removedByAuthorLabel}
          uiEvents={uiEvents}
          trackEvent={trackEvent}
          accentBorderTop={accentBorderTop}
          replyFragmentItem={replyFragmentItem}
          showReplyFragment={showReplyFragment}
          logger={logger}
          onLoginModalOpen={onLoginModalOpen}
          navigateToModal={navigateToModal}
          loggedProfileData={loggedProfileData}
          i18n={i18n}
        />
      }
    />
  );
};

export default EntryFeed;

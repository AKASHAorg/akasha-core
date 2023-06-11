import * as React from 'react';
import { ILocale } from '@akashaorg/design-system/src/utils/time';
import { useEntryNavigation } from '@akashaorg/ui-awf-hooks';
import { EntityTypes } from '@akashaorg/typings/ui';
import { FeedWidgetProps } from './App';
import EntryRenderer from './entry-renderer';
import EntryList from '@akashaorg/design-system-components/lib/components/EntryList';

const EntryFeed = (props: FeedWidgetProps) => {
  const handleEntryNavigate = useEntryNavigation(props.navigateTo);

  const handleRepost = (_withComment: boolean, entryId: string) => {
    if (!props.loggedProfileData?.did.id) {
      props.navigateToModal({ name: 'login' });
    } else {
      props.navigateTo?.({
        appName: '@akashaorg/app-akasha-integration',
        getNavigationUrl: () => `/feed?repost=${entryId}`,
      });
    }
  };

  return (
    <EntryList
      onLoadMore={props.onLoadMore}
      status={props.requestStatus}
      pages={props.pages}
      itemSpacing={props.itemSpacing}
      hasNextPage={props.hasNextPage}
      pageKeyPrefix={props.itemType === EntityTypes.POST ? 'entry-page' : 'comment-page'}
      viewAllEntry={props.viewAllEntry}
      languageDirection={props.i18n?.dir() || 'ltr'}
      itemCard={
        <EntryRenderer
          modalSlotId={props.modalSlotId}
          itemType={props.itemType}
          sharePostUrl={`${window.location.origin}/@akashaorg/app-akasha-integration/post/`}
          locale={props.i18n?.languages[0] as ILocale}
          onEntryNavigate={handleEntryNavigate}
          navigateTo={props.navigateTo}
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
          accentBorderTop={props.accentBorderTop}
          replyFragmentItem={props.replyFragmentItem}
          showReplyFragment={props.showReplyFragment}
          logger={props.logger}
          onLoginModalOpen={props.onLoginModalOpen}
          navigateToModal={props.navigateToModal}
          loggedProfileData={props.loggedProfileData}
          i18n={props.i18n}
        />
      }
    />
  );
};

export default EntryFeed;

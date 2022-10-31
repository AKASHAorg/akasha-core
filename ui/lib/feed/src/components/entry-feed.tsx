import * as React from 'react';
import DS from '@akashaorg/design-system';
import { ILocale } from '@akashaorg/design-system/lib/utils/time';
import { useEntryNavigation } from '@akashaorg/ui-awf-hooks';
import { EntityTypes } from '@akashaorg/typings/ui';
import { IFeedWidgetProps } from './App';
import EntryRenderer from './entry-renderer';

const { EntryList } = DS;

const EntryFeed = (props: IFeedWidgetProps) => {
  const handleEntryNavigate = useEntryNavigation(props.navigateTo);

  const handleRepost = (_withComment: boolean, entryId: string) => {
    if (!props.loginState.pubKey) {
      props.navigateToModal({ name: 'login' });
    } else {
      props.navigateTo?.({
        appName: '@akashaorg/app-akasha-integration',
        getNavigationUrl: navRoutes => `${navRoutes.Post}/${entryId}?action=repost`,
      });
    }
  };

  return (
    <EntryList
      pages={props.pages}
      onLoadMore={props.onLoadMore}
      status={props.requestStatus}
      itemSpacing={props.itemSpacing}
      hasNextPage={props.hasNextPage}
      pageKeyPrefix={props.itemType === EntityTypes.ENTRY ? 'entry-page' : 'comment-page'}
      viewAllEntry={props.viewAllEntry}
      itemCard={
        <EntryRenderer
          modalSlotId={props.modalSlotId}
          loginState={props.loginState}
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
          replyFragment={props.replyFragment}
          firstLevelReply={props.firstLevelReply}
          logger={props.logger}
          onLoginModalOpen={props.onLoginModalOpen}
          navigateToModal={props.navigateToModal}
          loggedProfile={props.loggedProfile}
          i18n={props.i18n}
        />
      }
    />
  );
};

export default EntryFeed;

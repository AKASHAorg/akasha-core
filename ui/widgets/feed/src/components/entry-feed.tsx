import * as React from 'react';
import DS from '@akashaproject/design-system';
import { IFeedWidgetProps, ItemTypes } from './App';
import { useErrors, useFollow, useBookmarks, useLoginState } from '@akashaproject/ui-awf-hooks';
import EntryRenderer from './entry-renderer';
import { useTranslation } from 'react-i18next';
import { ILocale } from '@akashaproject/design-system/src/utils/time';

const { VirtualList, ErrorInfoCard, ErrorLoader } = DS;

const EntryFeed = (props: IFeedWidgetProps) => {
  const { errors } = props;
  const [errorState, errorActions] = useErrors({ logger: props.logger });
  const { t, i18n } = useTranslation('ui-widget-feed');

  const [loginState] = useLoginState({
    onError: errorActions.createError,
  });

  const [followedProfiles, followActions] = useFollow({
    onError: errorActions.createError,
  });

  const [bookmarkState, bookmarkActions] = useBookmarks({
    onError: errorActions.createError,
  });

  React.useEffect(() => {
    if (loginState.waitForAuth && !loginState.ready) {
      return;
    }
    if (
      (loginState.waitForAuth && loginState.ready) ||
      (loginState.currentUserCalled && loginState.ethAddress)
    ) {
      bookmarkActions.getBookmarks();
    }
  }, [JSON.stringify(loginState)]);

  const handleBookmark = (isBookmarked: boolean, entryId: string) => {
    if (props.loggedProfile.pubKey) {
      if (props.itemType === ItemTypes.COMMENT) {
        if (!isBookmarked) {
          return bookmarkActions.bookmarkComment(entryId);
        }
        return bookmarkActions.removeBookmark(entryId);
      }
      if (props.itemType === ItemTypes.ENTRY) {
        if (!isBookmarked) {
          return bookmarkActions.bookmarkPost(entryId);
        }
        return bookmarkActions.removeBookmark(entryId);
      }
    } else {
      props.onLoginModalOpen();
    }
  };
  const handleRepost = (_withComment: boolean, entryData: any) => {
    if (!props.loggedProfile.pubKey) {
      props.onLoginModalOpen();
    } else {
      props.navigateToModal({ name: 'editor', embedEntry: entryData });
    }
  };
  const locale: any = i18n.languages[0];

  const hasMoreItems = React.useMemo(() => {
    if (props.totalItems && props.itemIds?.length) {
      return props.totalItems > props.itemIds.length;
    }
    // defaults to true,
    // meaning that the list will try to fetch
    // the first/next batch of items
    return true;
  }, [props.totalItems, props.itemIds?.length]);

  return (
    <ErrorInfoCard errors={{ ...errors, ...errorState }}>
      {(messages, hasCriticalErrors) => (
        <>
          {messages && (
            <ErrorLoader
              style={{ marginTop: '.5em' }}
              type="script-error"
              title={t('There was an error loading the list')}
              details={messages}
            />
          )}
          {!hasCriticalErrors && (
            <VirtualList
              ref={props.virtualListRef}
              items={props.itemIds}
              itemsData={props.itemsData}
              loadMore={props.loadMore}
              loadItemData={props.loadItemData}
              listHeader={props.listHeader}
              hasMoreItems={hasMoreItems}
              itemCard={
                <EntryRenderer
                  pubKey={props.profilePubKey}
                  ethAddress={props.ethAddress}
                  itemType={props.itemType}
                  sharePostUrl={`${window.location.origin}/social-app/post/`}
                  locale={locale as ILocale}
                  bookmarkState={bookmarkState}
                  followedProfiles={followedProfiles}
                  checkIsFollowing={followActions.isFollowing}
                  onFollow={followActions.follow}
                  onUnfollow={followActions.unfollow}
                  onBookmark={handleBookmark}
                  onNavigate={props.onNavigate}
                  singleSpaNavigate={props.singleSpaNavigate}
                  onFlag={props.onEntryFlag}
                  onRepost={handleRepost}
                  contentClickable={props.contentClickable}
                  awaitingModerationLabel={t(
                    'You have reported this content. It is awaiting moderation.',
                  )}
                  moderatedContentLabel={t('This content has been moderated')}
                  ctaLabel={t('See it anyway')}
                  handleFlipCard={props.handleFlipCard}
                />
              }
            />
          )}
        </>
      )}
    </ErrorInfoCard>
  );
};

export default EntryFeed;

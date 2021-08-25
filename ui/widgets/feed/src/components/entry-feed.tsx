import * as React from 'react';
import DS from '@akashaproject/design-system';
import { IFeedWidgetProps } from './App';
import { useFollow, useBookmarks } from '@akashaproject/ui-awf-hooks';
import EntryRenderer from './entry-renderer';
import { useTranslation } from 'react-i18next';
import { ItemTypes } from '@akashaproject/ui-awf-typings/lib/app-loader';
import { ILocale } from '@akashaproject/design-system/lib/utils/time';

const { EntryList } = DS;

const EntryFeed = (props: IFeedWidgetProps) => {
  const { t } = useTranslation();

  const [followedProfiles, followActions] = useFollow({});

  const [bookmarkState, bookmarkActions] = useBookmarks({});

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
  const handleRepost = (_withComment: boolean, entryId: any) => {
    if (!props.loggedProfile.pubKey) {
      props.onLoginModalOpen();
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
      itemCard={
        <EntryRenderer
          pubKey={props.profilePubKey}
          ethAddress={props.ethAddress}
          itemType={props.itemType}
          sharePostUrl={`${window.location.origin}/social-app/post/`}
          locale={props.i18n.languages[0] as ILocale}
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
          awaitingModerationLabel={t('You have reported this content. It is awaiting moderation.')}
          moderatedContentLabel={t('This content has been moderated')}
          ctaLabel={t('See it anyway')}
          handleFlipCard={props.handleFlipCard}
          onEntryRemove={props.onEntryRemove}
          removeEntryLabel={props.removeEntryLabel}
          removedByMeLabel={props.removedByMeLabel}
          removedByAuthorLabel={props.removedByAuthorLabel}
          uiEvents={props.uiEvents}
        />
      }
    />
  );
};

export default EntryFeed;

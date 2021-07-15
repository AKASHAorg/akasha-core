import React from 'react';
import DS from '@akashaproject/design-system';
import { useTranslation } from 'react-i18next';
import { useFollow } from '@akashaproject/ui-awf-hooks';
import { IAkashaError } from '@akashaproject/ui-awf-typings';
import { IBookmarkState } from '@akashaproject/ui-awf-hooks/lib/use-entry-bookmark';
import routes, { POST } from '../../routes';

const { ErrorInfoCard, ErrorLoader, EntryCard, EntryCardHidden, EntryCardLoading } = DS;

export interface IEntryCardRendererProps {
  logger: any;
  itemId?: string;
  itemData?: any;
  isBookmarked?: boolean;
  locale?: any;
  ethAddress: string | null;
  onBookmark: (entryId: string) => void;
  onNavigate: (details: any) => void;
  onLinkCopy?: () => void;
  onFlag?: (entryId: string, contentType: string) => () => void;
  onRepost: (withComment: boolean, entryData: any) => void;
  sharePostUrl: string;
  onAvatarClick: (ev: React.MouseEvent<HTMLDivElement>, authorEth: string) => void;
  onMentionClick: (pubKey: string) => void;
  onTagClick: (name: string) => void;
  singleSpaNavigate: (url: string) => void;
  bookmarkState?: IBookmarkState;
  style?: React.CSSProperties;
  contentClickable?: boolean;
  disableActions?: boolean;
  hidePublishTime?: boolean;
  moderatedContentLabel?: string;
  awaitingModerationLabel?: string;
  ctaLabel?: string;
  handleFlipCard?: (entry: any, isQuote: boolean) => () => void;
  onEntryRemove?: (entryId: string) => void;
  removeEntryLabel?: string;
  removedByMeLabel?: string;
  removedByAuthorLabel?: string;
}

const EntryCardRenderer = (props: IEntryCardRendererProps) => {
  const {
    itemData,
    ethAddress,
    locale,
    bookmarkState,
    itemId,
    style,
    logger,
    contentClickable,
    hidePublishTime,
    moderatedContentLabel,
    awaitingModerationLabel,
    ctaLabel,
    handleFlipCard,
    disableActions,
    sharePostUrl,
  } = props;

  const isBookmarked = React.useMemo(() => {
    if (
      bookmarkState &&
      !bookmarkState.isFetching &&
      itemId &&
      bookmarkState.bookmarks.findIndex(bm => bm.entryId === itemId) >= 0
    ) {
      return true;
    }

    return false;
  }, [bookmarkState]);

  const { t } = useTranslation();

  const [followedProfiles, followActions] = useFollow({
    onError: (errorInfo: IAkashaError) => {
      logger.error(errorInfo.error.message, errorInfo.errorKey);
    },
  });

  React.useEffect(() => {
    if (ethAddress && itemData.author.ethAddress) {
      followActions.isFollowing(ethAddress, itemData.author.ethAddress);
    }
  }, [ethAddress, itemData.author.ethAddress]);

  const handleFollow = () => {
    if (itemData.author.ethAddress) {
      followActions.follow(itemData.author.ethAddress);
    }
  };

  const handleUnfollow = () => {
    if (itemData.author.ethAddress) {
      followActions.unfollow(itemData.author.ethAddress);
    }
  };

  const isFollowing = followedProfiles.includes(itemData.author.ethAddress);

  if (itemData.reported) {
    return (
      <EntryCardHidden
        awaitingModerationLabel={awaitingModerationLabel}
        ctaLabel={ctaLabel}
        handleFlipCard={handleFlipCard && handleFlipCard(itemData, false)}
      />
    );
  }

  return (
    <ErrorInfoCard errors={{}}>
      {(errorMessages: any, hasCriticalErrors: boolean) => (
        <>
          {errorMessages && (
            <ErrorLoader
              type="script-error"
              title={t('There was an error loading the entry')}
              details={t('We cannot show this entry right now')}
              devDetails={errorMessages}
            />
          )}
          {!hasCriticalErrors && (
            <>
              {(!itemData || !itemData.author?.ethAddress) && <EntryCardLoading />}
              {itemData && itemData.author.ethAddress && (
                <EntryCard
                  isRemoved={
                    itemData.content.length === 1 && itemData.content[0].property === 'removed'
                  }
                  isBookmarked={isBookmarked}
                  entryData={itemData}
                  sharePostLabel={t('Share Post')}
                  shareTextLabel={t('Share this post with your friends')}
                  sharePostUrl={sharePostUrl}
                  onClickAvatar={(ev: React.MouseEvent<HTMLDivElement>) =>
                    props.onAvatarClick(ev, itemData.author.pubKey)
                  }
                  onEntryBookmark={props.onBookmark}
                  repliesLabel={t('Replies')}
                  repostsLabel={t('Reposts')}
                  repostLabel={t('Repost')}
                  repostWithCommentLabel={t('Repost with comment')}
                  shareLabel={t('Share')}
                  copyLinkLabel={t('Copy Link')}
                  flagAsLabel={t('Report Post')}
                  loggedProfileEthAddress={ethAddress}
                  locale={locale || 'en'}
                  style={{ height: 'auto', ...style }}
                  bookmarkLabel={t('Save')}
                  bookmarkedLabel={t('Saved')}
                  profileAnchorLink={'/profile'}
                  repliesAnchorLink={routes[POST]}
                  onRepost={props.onRepost}
                  onEntryFlag={props.onFlag && props.onFlag(itemData.entryId, 'post')}
                  handleFollowAuthor={handleFollow}
                  handleUnfollowAuthor={handleUnfollow}
                  isFollowingAuthor={isFollowing}
                  onContentClick={props.onNavigate}
                  onMentionClick={props.onMentionClick}
                  onTagClick={props.onTagClick}
                  singleSpaNavigate={props.singleSpaNavigate}
                  contentClickable={contentClickable}
                  hidePublishTime={hidePublishTime}
                  moderatedContentLabel={moderatedContentLabel}
                  awaitingModerationLabel={awaitingModerationLabel}
                  ctaLabel={ctaLabel}
                  handleFlipCard={handleFlipCard}
                  disableActions={disableActions}
                  onEntryRemove={props.onEntryRemove}
                  removeEntryLabel={props.removeEntryLabel}
                  removedByMeLabel={props.removedByMeLabel}
                  removedByAuthorLabel={props.removedByAuthorLabel}
                />
              )}
            </>
          )}
        </>
      )}
    </ErrorInfoCard>
  );
};

export default EntryCardRenderer;

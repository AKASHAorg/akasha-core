import * as React from 'react';
import { IBookmarkState } from '@akashaproject/ui-awf-hooks/lib/use-entry-bookmark';
import DS from '@akashaproject/design-system';
import { ILocale } from '@akashaproject/design-system/src/utils/time';
import { IContentClickDetails } from '@akashaproject/design-system/src/components/Cards/entry-cards/entry-box';
import { useTranslation } from 'react-i18next';
import { ServiceNames } from '@akashaproject/design-system/src/components/Cards/entry-cards/card-actions';
import { ItemTypes } from './App';

const { ErrorInfoCard, ErrorLoader, EntryCardLoading, EntryCard } = DS;

export interface IEntryRenderer {
  itemId?: string;
  itemData?: any;
  getShareUrl?: (entryId: string) => string;
  ethAddress: string | null;
  pubKey: string | null;
  locale: ILocale;
  bookmarkState: IBookmarkState;
  style?: React.CSSProperties;
  followedProfiles: string[];
  onFollow: (ethAddress: string) => void;
  onUnfollow: (ethAddress: string) => void;
  onBookmark: (isBookmarked: boolean, entryId: string) => void;
  onReport: (itemId: string, reporterEthAddress: string) => void;
  onRepost: (withComment: boolean, entryData: any) => void;
  onNavigate: (itemType: ItemTypes, details: IContentClickDetails) => void;
  checkIsFollowing: (viewerEthAddress: string, targetEthAddress: string) => void;
  contentClickable?: boolean;
  itemType: ItemTypes;
}

const EntryRenderer = (props: IEntryRenderer) => {
  const {
    itemData,
    ethAddress,
    locale,
    bookmarkState,
    itemId,
    style,
    followedProfiles,
    onFollow,
    onUnfollow,
    onBookmark,
    onReport,
    onNavigate,
    checkIsFollowing,
    getShareUrl,
    onRepost,
    contentClickable,
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

  const { t } = useTranslation('ui-widget-feed');

  React.useEffect(() => {
    if (ethAddress && itemData.author.ethAddress) {
      checkIsFollowing(ethAddress, itemData.author.ethAddress);
    }
  }, [ethAddress, itemData.author.ethAddress]);

  const handleFollow = () => {
    if (itemData.author.ethAddress) {
      onFollow(itemData.author.ethAddress);
    }
  };

  const handleUnfollow = () => {
    if (itemData.author.ethAddress) {
      onUnfollow(itemData.author.ethAddress);
    }
  };

  const handleAvatarClick = (_ev: React.MouseEvent<HTMLDivElement>) => {
    onNavigate(ItemTypes.PROFILE, {
      entryId: itemData.author.pubKey,
      authorEthAddress: itemData.author.ethAddress,
      replyTo: null,
    });
  };

  const handleEntryReport = () => {
    if (onReport && props.ethAddress) {
      onReport(itemData.entryId, props.ethAddress);
    }
  };
  const handleNavigation = (details: IContentClickDetails) => {
    onNavigate(props.itemType, details);
  };

  const handleContentClick = (details: IContentClickDetails) => {
    handleNavigation(details);
  };

  const handleMentionClick = (pubKey: string) => {
    onNavigate(ItemTypes.PROFILE, {
      entryId: pubKey,
      authorEthAddress: pubKey,
      replyTo: null,
    });
  };

  const handleShare = (service: ServiceNames, entryId: string) => {
    if (!getShareUrl) {
      return;
    }
    const url = getShareUrl(entryId);
    let shareUrl;
    switch (service) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${url}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case 'reddit':
        shareUrl = `http://www.reddit.com/submit?url=${url}`;
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        break;
      default:
        break;
    }
    window.open(shareUrl, '_blank');
  };
  const handleEntryBookmark = (entryId: string) => {
    onBookmark(isBookmarked, entryId);
  };
  const isFollowing = React.useMemo(() => followedProfiles.includes(itemData.author.ethAddress), [
    followedProfiles,
  ]);

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
                  isBookmarked={isBookmarked}
                  entryData={itemData}
                  sharePostUrl="https://ethereum.world"
                  sharePostLabel={t('Share Post')}
                  shareTextLabel={t('Share this post with your friends')}
                  onClickAvatar={handleAvatarClick}
                  onEntryBookmark={handleEntryBookmark}
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
                  onRepost={onRepost}
                  onEntryShare={handleShare}
                  onEntryFlag={handleEntryReport}
                  handleFollowAuthor={handleFollow}
                  handleUnfollowAuthor={handleUnfollow}
                  isFollowingAuthor={isFollowing}
                  onContentClick={handleContentClick}
                  onMentionClick={handleMentionClick}
                  contentClickable={contentClickable}
                />
              )}
            </>
          )}
        </>
      )}
    </ErrorInfoCard>
  );
};

export default EntryRenderer;

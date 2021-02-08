import React from 'react';
import DS from '@akashaproject/design-system';
import { useTranslation } from 'react-i18next';
import { useFollow } from '@akashaproject/ui-awf-hooks';
import { IAkashaError } from '@akashaproject/ui-awf-typings';
import { IBookmarkState } from '@akashaproject/ui-awf-hooks/lib/use-entry-bookmark';

const { ErrorInfoCard, ErrorLoader, EntryCard, EntryCardLoading } = DS;

export interface IEntryCardRendererProps {
  sdkModules: any;
  logger: any;
  globalChannel: any;
  itemId?: string;
  itemData?: any;
  isBookmarked?: boolean;
  locale?: any;
  ethAddress: string | null;
  onBookmark: (entryId: string) => void;
  onNavigate: (details: any) => void;
  onLinkCopy?: () => void;
  onRepliesClick: () => void;
  onFlag?: (entryId: string, user?: string | null) => () => void;
  onRepost: (withComment: boolean, entryData: any) => void;
  onShare: (service: string, entryId: string, authorEthAddress: string) => void;
  onAvatarClick: (ev: React.MouseEvent<HTMLDivElement>, authorEth: string) => void;
  onMentionClick: (ethAddress: string) => void;
  bookmarkState?: IBookmarkState;
  style?: React.CSSProperties;
  contentClickable?: boolean;
  disableIpfsCopyLink?: boolean;
}

const EntryCardRenderer = (props: IEntryCardRendererProps) => {
  const {
    itemData,
    ethAddress,
    locale,
    bookmarkState,
    itemId,
    style,
    sdkModules,
    logger,
    globalChannel,
    contentClickable,
    disableIpfsCopyLink,
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
    globalChannel,
    profileService: sdkModules.profiles.profileService,
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
                  sharePostLabel={t('Share Post')}
                  shareTextLabel={t('Share this post with your friends')}
                  sharePostUrl={'https://ethereum.world'}
                  onClickAvatar={(ev: React.MouseEvent<HTMLDivElement>) =>
                    props.onAvatarClick(ev, itemData.author.ethAddress)
                  }
                  onEntryBookmark={props.onBookmark}
                  repliesLabel={t('Replies')}
                  repostsLabel={t('Reposts')}
                  repostLabel={t('Repost')}
                  repostWithCommentLabel={t('Repost with comment')}
                  shareLabel={t('Share')}
                  copyLinkLabel={t('Copy Link')}
                  copyIPFSLinkLabel={t('Copy IPFS Link')}
                  flagAsLabel={t('Report Post')}
                  loggedProfileEthAddress={ethAddress}
                  locale={locale || 'en'}
                  style={{ height: 'auto', ...style }}
                  bookmarkLabel={t('Save')}
                  bookmarkedLabel={t('Saved')}
                  onRepost={props.onRepost}
                  onEntryShare={props.onShare}
                  onEntryFlag={props.onFlag && props.onFlag(itemData.entryId, props.ethAddress)}
                  onClickReplies={props.onRepliesClick}
                  handleFollowAuthor={handleFollow}
                  handleUnfollowAuthor={handleUnfollow}
                  isFollowingAuthor={isFollowing}
                  onContentClick={props.onNavigate}
                  onMentionClick={props.onMentionClick}
                  contentClickable={contentClickable}
                  disableIpfsCopyLink={disableIpfsCopyLink}
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

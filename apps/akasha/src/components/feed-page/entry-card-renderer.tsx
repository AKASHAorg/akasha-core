import React from 'react';
import DS from '@akashaproject/design-system';
import { useTranslation } from 'react-i18next';

const { ErrorInfoCard, ErrorLoader, EntryCard, EntryCardLoading } = DS;

export interface IEntryCardRendererProps {
  itemId?: string;
  itemData?: any;
  isBookmarked?: boolean;
  locale?: any;
  ethAddress?: string | null;
  onFollow: () => void;
  onUnfollow: () => void;
  onBookmark: (entryId: string) => void;
  onNavigate: (details: any) => void;
  onLinkCopy?: () => void;
  onRepliesClick: () => void;
  onFlag: (entryId: string, user: string | null) => () => void;
  onRepost: (withComment: boolean, entryData: any) => void;
  onShare: (service: string, entryId: string) => void;
  onAvatarClick: (ev: React.MouseEvent<HTMLDivElement>, authorEth: string) => void;
  bookmarks?: Set<string>;
  style?: React.CSSProperties;
}

const EntryCardRenderer = (props: IEntryCardRendererProps) => {
  const { itemData, ethAddress, locale, bookmarks, itemId, style } = props;

  let isBookmarked = false;
  if (bookmarks && itemId && bookmarks.has(itemId)) {
    isBookmarked = true;
  }
  console.log(itemData, 'item data');
  const { t } = useTranslation();

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
                  loggedProfileEthAddress={ethAddress as any}
                  locale={locale || 'en'}
                  style={{ height: 'auto', ...style }}
                  bookmarkLabel={t('Save')}
                  bookmarkedLabel={t('Saved')}
                  onRepost={props.onRepost}
                  onEntryShare={props.onShare}
                  onEntryFlag={props.onFlag(itemData.CID, null)}
                  onClickReplies={props.onRepliesClick}
                  handleFollow={props.onFollow}
                  handleUnfollow={props.onUnfollow}
                  onContentClick={props.onNavigate}
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

import React from 'react';
import DS from '@akashaproject/design-system';
import { useTranslation } from 'react-i18next';
import { useIsFollowing } from '@akashaproject/ui-awf-hooks/lib/use-follow.new';
import { BookmarkTypes } from '@akashaproject/ui-awf-hooks/lib/use-entry-bookmark';
import { usePost } from '@akashaproject/ui-awf-hooks/lib/use-posts.new';
import { useComment } from '@akashaproject/ui-awf-hooks/lib/use-comments.new';
import { mapEntry } from '@akashaproject/ui-awf-hooks/lib/utils/entry-utils';

const { ErrorLoader, EntryCard, /* EntryCardHidden, */ EntryCardLoading } = DS;

export interface NavigationDetails {
  authorEthAddress: string;
  entryId: string;
  replyTo: {
    authorEthAddress?: string;
    entryId: string;
  } | null;
}

export interface IEntryCardRendererProps {
  logger: any;
  singleSpa: any;
  itemId?: string;
  itemData?: any;
  isBookmarked?: boolean;
  locale?: any;
  ethAddress?: string | null;
  onBookmark: (entryId: string) => void;
  onNavigate: (details: NavigationDetails) => void;
  onLinkCopy?: () => void;
  onRepost: (withComment: boolean, entryData: any) => void;
  sharePostUrl: string;
  onAvatarClick: (ev: React.MouseEvent<HTMLDivElement>, authorEth: string) => void;
  onMentionClick: (ethAddress: string) => void;
  onTagClick: (name: string) => void;
  bookmarks?: { entryId: string; type: BookmarkTypes }[];
  style?: React.CSSProperties;
  contentClickable?: boolean;
  disableReposting?: boolean;
  moderatedContentLabel?: string;
  ctaLabel?: string;
  handleFlipCard?: (entry: any, isQuote: boolean) => () => void;
}

const EntryCardRenderer = (props: IEntryCardRendererProps) => {
  const {
    ethAddress,
    locale,
    bookmarks,
    itemId,
    style,
    contentClickable,
    disableReposting,
    // moderatedContentLabel,
    // awaitingModerationLabel,
    // ctaLabel,
    // handleFlipCard,
  } = props;

  const { t } = useTranslation();
  const type = React.useMemo(() => {
    if (bookmarks) {
      return bookmarks.find(b => b.entryId === itemId).type;
    }
    return undefined;
  }, [bookmarks, itemId]);

  const postReq = usePost(itemId, type === BookmarkTypes.POST);
  const commentReq = useComment(itemId, type === BookmarkTypes.COMMENT);

  const itemData = React.useMemo(() => {
    if (type === BookmarkTypes.COMMENT && commentReq.status === 'success') {
      return mapEntry(commentReq.data);
    } else if (type === BookmarkTypes.POST && postReq.status === 'success') {
      return mapEntry(postReq.data);
    }
  }, [type, postReq.data, postReq.status, commentReq.data, commentReq.status]);

  const isFollowing = useIsFollowing(
    ethAddress,
    itemData?.author.ethAddress,
    !!itemData && !!itemData.author && !!itemData.author.ethAddress,
  );

  const handleFollow = () => {
    /* todo */
  };

  const handleUnfollow = () => {
    /* todo */
  };

  // if (itemData.reported) {
  //   return (
  //     <EntryCardHidden
  //       awaitingModerationLabel={awaitingModerationLabel}
  //       moderatedContentLabel={moderatedContentLabel}
  //       ctaLabel={ctaLabel}
  //       handleFlipCard={handleFlipCard && handleFlipCard(itemData, false)}
  //     />
  //   );
  // }
  return (
    <>
      {(postReq.status === 'error' || commentReq.status === 'error') && (
        <ErrorLoader
          type="script-error"
          title={t('There was an error loading the entry')}
          details={t('We cannot show this entry right now')}
          devDetails={postReq.error || commentReq.error}
        />
      )}
      {(postReq.status === 'success' || commentReq.status === 'success') && (
        <>
          {(postReq.status === 'loading' || commentReq.status === 'loading') && (
            <EntryCardLoading />
          )}
          {itemData && itemData.author.ethAddress && (
            <EntryCard
              isRemoved={
                itemData.content.length === 1 && itemData.content[0].property === 'removed'
              }
              isBookmarked={true}
              entryData={itemData}
              sharePostLabel={t('Share Post')}
              shareTextLabel={t('Share this post with your friends')}
              sharePostUrl={props.sharePostUrl}
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
              flagAsLabel={t('Report Post')}
              loggedProfileEthAddress={ethAddress as any}
              locale={locale || 'en'}
              style={{ height: 'auto', ...style }}
              bookmarkLabel={t('Save')}
              bookmarkedLabel={t('Saved')}
              profileAnchorLink={'/profile'}
              repliesAnchorLink={'/social-app/post'}
              onRepost={props.onRepost}
              handleFollowAuthor={handleFollow}
              handleUnfollowAuthor={handleUnfollow}
              isFollowingAuthor={isFollowing.data.includes(ethAddress)}
              onContentClick={() => {
                props.onNavigate({
                  authorEthAddress: itemData.author.ethAddress,
                  entryId: itemData.entryId,
                  replyTo: {
                    entryId: type === BookmarkTypes.COMMENT ? itemData.postId : null,
                  },
                });
              }}
              onMentionClick={props.onMentionClick}
              onTagClick={props.onTagClick}
              singleSpaNavigate={props.singleSpa.navigateToUrl}
              contentClickable={contentClickable}
              disableReposting={disableReposting}
            />
          )}
        </>
      )}
    </>
  );
};

export default EntryCardRenderer;

import * as React from 'react';
import { IBookmarkState } from '@akashaproject/ui-awf-hooks/lib/use-entry-bookmark';
import DS from '@akashaproject/design-system';
import { ILocale } from '@akashaproject/design-system/lib/utils/time';
import { IContentClickDetails } from '@akashaproject/design-system/lib/components/EntryCard/entry-box';
import { useTranslation } from 'react-i18next';
import { RootComponentProps } from '@akashaproject/ui-awf-typings';
import { EventTypes, ItemTypes } from '@akashaproject/ui-awf-typings/lib/app-loader';
import { usePost } from '@akashaproject/ui-awf-hooks/lib/use-posts.new';
import { useComment } from '@akashaproject/ui-awf-hooks/lib/use-comments.new';
import { mapEntry } from '@akashaproject/ui-awf-hooks/lib/utils/entry-utils';

const { ErrorInfoCard, ErrorLoader, EntryCardLoading, EntryCard, EntryCardHidden, ExtensionPoint } =
  DS;

export interface IEntryRenderer {
  itemId?: string;
  itemData?: any;
  sharePostUrl: string;
  ethAddress: string | null;
  pubKey: string | null;
  locale: ILocale;
  bookmarkState: IBookmarkState;
  style?: React.CSSProperties;
  followedProfiles: string[];
  onFollow: (ethAddress: string) => void;
  onUnfollow: (ethAddress: string) => void;
  onBookmark: (isBookmarked: boolean, entryId: string) => void;
  onFlag?: (entryId: string, contentType: string, reporterEthAddress?: string | null) => () => void;
  onRepost: (withComment: boolean, entryData: any) => void;
  onNavigate: (itemType: ItemTypes, details: IContentClickDetails) => void;
  singleSpaNavigate: (url: string) => void;
  checkIsFollowing: (viewerEthAddress: string, targetEthAddress: string) => void;
  contentClickable?: boolean;
  itemType: ItemTypes;
  moderatedContentLabel?: string;
  awaitingModerationLabel?: string;
  ctaLabel?: string;
  handleFlipCard?: (entry: any, isQuote: boolean) => () => void;
  onEntryRemove?: (entryId: string) => void;
  removeEntryLabel?: string;
  removedByMeLabel?: string;
  removedByAuthorLabel?: string;
  uiEvents: RootComponentProps['uiEvents'];
  className?: string;
}

const EntryRenderer = (props: IEntryRenderer) => {
  const {
    ethAddress,
    locale,
    bookmarkState,
    itemId,
    style,
    followedProfiles,
    onFollow,
    onUnfollow,
    onBookmark,
    onFlag,
    onNavigate,
    singleSpaNavigate,
    checkIsFollowing,
    sharePostUrl,
    onRepost,
    contentClickable,
    moderatedContentLabel,
    awaitingModerationLabel,
    ctaLabel,
    handleFlipCard,
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
  }, [bookmarkState, itemId]);

  const { t } = useTranslation('ui-widget-feed');

  const postReq = usePost(itemId, props.itemType === ItemTypes.ENTRY);
  const commentReq = useComment(itemId, props.itemType === ItemTypes.COMMENT);

  const postData = React.useMemo(() => {
    if (postReq.data && props.itemType === ItemTypes.ENTRY) {
      return mapEntry(postReq.data);
    }
    return undefined;
  }, [postReq.data, props.itemType]);

  const commentData = React.useMemo(() => {
    if (commentReq.data && props.itemType === ItemTypes.COMMENT) {
      return mapEntry(commentReq.data);
    }
    return undefined;
  }, [commentReq.data, props.itemType]);

  const itemData = React.useMemo(() => {
    if (props.itemType === ItemTypes.ENTRY) {
      return postData;
    } else if (props.itemType === ItemTypes.COMMENT) {
      return commentData;
    }
  }, [postData, commentData, props.itemType]);

  React.useEffect(() => {
    if (ethAddress && itemData.author.ethAddress) {
      checkIsFollowing(ethAddress, itemData.author.ethAddress);
    }
  }, [ethAddress, itemData]);

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

  const handleAvatarClick = () => {
    onNavigate(ItemTypes.PROFILE, {
      entryId: itemData.author.pubKey,
      authorEthAddress: itemData.author.ethAddress,
      replyTo: null,
    });
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

  const handleTagClick = (name: string) => {
    onNavigate(ItemTypes.TAG, {
      entryId: name,
      authorEthAddress: name,
      replyTo: null,
    });
  };

  const handleEntryBookmark = (entryId: string) => {
    onBookmark(isBookmarked, entryId);
  };

  const onEditButtonMount = (name: string) => {
    props.uiEvents.next({
      event: EventTypes.ExtensionPointMount,
      data: {
        name,
        entryId: itemId,
      },
    });
  };

  const onEditButtonUnmount = () => {
    /* todo */
  };

  const isFollowing = React.useMemo(() => {
    if (itemData && itemData.author) {
      return followedProfiles.includes(itemData.author.ethAddress);
    }
    return false;
  }, [followedProfiles, itemData]);

  if (itemData && itemData.reported) {
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
              {(postReq.status === 'loading' || commentReq.status === 'loading') && (
                <EntryCardLoading />
              )}
              {itemData && itemData.author.ethAddress && (
                <EntryCard
                  className={props.className}
                  isRemoved={
                    itemData.content.length === 1 && itemData.content[0].property === 'removed'
                  }
                  isBookmarked={isBookmarked}
                  entryData={itemData}
                  sharePostUrl={sharePostUrl}
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
                  style={{ height: 'auto', ...(style as React.CSSProperties) }}
                  bookmarkLabel={t('Save')}
                  bookmarkedLabel={t('Saved')}
                  profileAnchorLink={'/profile'}
                  repliesAnchorLink={'/social-app/post'}
                  onRepost={onRepost}
                  onEntryFlag={onFlag && onFlag(itemData.entryId, 'post')}
                  handleFollowAuthor={handleFollow}
                  handleUnfollowAuthor={handleUnfollow}
                  isFollowingAuthor={isFollowing}
                  onContentClick={handleContentClick}
                  onMentionClick={handleMentionClick}
                  onTagClick={handleTagClick}
                  singleSpaNavigate={singleSpaNavigate}
                  contentClickable={contentClickable}
                  moderatedContentLabel={moderatedContentLabel}
                  awaitingModerationLabel={awaitingModerationLabel}
                  ctaLabel={ctaLabel}
                  handleFlipCard={handleFlipCard}
                  onEntryRemove={props.onEntryRemove}
                  removeEntryLabel={props.removeEntryLabel}
                  removedByMeLabel={props.removedByMeLabel}
                  removedByAuthorLabel={props.removedByAuthorLabel}
                  headerMenuExt={
                    ethAddress === itemData.author.ethAddress && (
                      <ExtensionPoint
                        name={`entry-card-edit-button_${itemId}`}
                        onMount={onEditButtonMount}
                        onUnmount={onEditButtonUnmount}
                      />
                    )
                  }
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

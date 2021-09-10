import * as React from 'react';
import DS from '@akashaproject/design-system';
import { ILocale } from '@akashaproject/design-system/lib/utils/time';
import { IContentClickDetails } from '@akashaproject/design-system/lib/components/EntryCard/entry-box';
import { useTranslation } from 'react-i18next';
import { RootComponentProps } from '@akashaproject/ui-awf-typings';
import { EventTypes, ItemTypes } from '@akashaproject/ui-awf-typings/lib/app-loader';
import { usePost } from '@akashaproject/ui-awf-hooks/lib/use-posts.new';
import { useComment } from '@akashaproject/ui-awf-hooks/lib/use-comments.new';
import { mapEntry } from '@akashaproject/ui-awf-hooks/lib/utils/entry-utils';
import { useGetBookmarks } from '@akashaproject/ui-awf-hooks/lib/use-bookmarks.new';
import {
  useFollow,
  useUnfollow,
  useIsFollowing,
} from '@akashaproject/ui-awf-hooks/lib/use-follow.new';

const { ErrorLoader, EntryCardLoading, EntryCard, EntryCardHidden, ExtensionPoint } = DS;

export interface IEntryRenderer {
  itemId?: string;
  sharePostUrl: string;
  ethAddress: string | null;
  pubKey: string | null;
  locale: ILocale;
  bookmarksQuery: ReturnType<typeof useGetBookmarks>;
  style?: React.CSSProperties;
  onBookmark: (isBookmarked: boolean, entryId: string) => void;
  onFlag?: (entryId: string, itemType: string, reporterEthAddress?: string | null) => () => void;
  onRepost: (withComment: boolean, entryId: string) => void;
  onNavigate: (itemType: ItemTypes, details: IContentClickDetails) => void;
  singleSpaNavigate: (url: string) => void;
  contentClickable?: boolean;
  itemType: ItemTypes;
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
    bookmarksQuery,
    itemId,
    style,
    onBookmark,
    onFlag,
    onNavigate,
    singleSpaNavigate,
    sharePostUrl,
    onRepost,
    contentClickable,
  } = props;

  const [showAnyway, setShowAnyway] = React.useState<boolean>(false);
  const followProfileQuery = useFollow();
  const unfollowProfileQuery = useUnfollow();

  const isBookmarked = React.useMemo(() => {
    if (
      bookmarksQuery.status === 'success' &&
      itemId &&
      Array.isArray(bookmarksQuery.data) &&
      bookmarksQuery.data.findIndex(bm => bm.entryId === itemId) >= 0
    ) {
      return true;
    }

    return false;
  }, [bookmarksQuery, itemId]);

  const { t } = useTranslation('ui-widget-feed');

  const postReq = usePost({ postId: itemId, enabler: props.itemType === ItemTypes.ENTRY });
  const commentReq = useComment(itemId, props.itemType === ItemTypes.COMMENT);
  const authorEthAddress = React.useMemo(() => {
    if (props.itemType === ItemTypes.COMMENT && commentReq.status === 'success') {
      return commentReq.data.author.ethAddress;
    }
    if (props.itemType === ItemTypes.ENTRY && postReq.status === 'success') {
      return postReq.data.author.ethAddress;
    }
  }, [props.itemType, commentReq, postReq]);

  const followedProfilesReq = useIsFollowing(props.ethAddress, authorEthAddress);

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

  const isFollowing = React.useMemo(() => {
    if (
      followedProfilesReq.status === 'success' &&
      followedProfilesReq.data.includes(authorEthAddress)
    ) {
      return true;
    }
    return false;
  }, [authorEthAddress, followedProfilesReq.data, followedProfilesReq.status]);

  const itemData = React.useMemo(() => {
    if (props.itemType === ItemTypes.ENTRY) {
      return postData;
    } else if (props.itemType === ItemTypes.COMMENT) {
      return commentData;
    }
  }, [postData, commentData, props.itemType]);

  const isReported = React.useMemo(() => {
    if (showAnyway) {
      return false;
    }
    return (postReq.status === 'success' || commentReq.status === 'success') && itemData?.reported;
  }, [itemData, showAnyway, postReq.status, commentReq.status]);

  const handleFollow = React.useCallback(() => {
    if (authorEthAddress) {
      followProfileQuery.mutate(authorEthAddress);
    }
  }, [followProfileQuery, authorEthAddress]);

  const handleUnfollow = React.useCallback(() => {
    if (authorEthAddress) {
      unfollowProfileQuery.mutate(authorEthAddress);
    }
  }, [unfollowProfileQuery, authorEthAddress]);

  const handleAvatarClick = () => {
    onNavigate(ItemTypes.PROFILE, {
      entryId: itemData?.author.pubKey,
      authorEthAddress: itemData?.author.ethAddress,
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

  const handleFlipCard = () => {
    setShowAnyway(true);
  };

  const itemTypeName = React.useMemo(() => {
    switch (props.itemType) {
      case ItemTypes.ENTRY:
        return t('post');
      case ItemTypes.PROFILE:
        return t('account');
      case ItemTypes.COMMENT:
        return t('reply');
      case ItemTypes.TAG:
        return t('tag');
      default:
        return t('unknown');
    }
  }, [t, props.itemType]);

  return (
    <>
      {(postReq.status === 'loading' || commentReq.status === 'loading') && <EntryCardLoading />}
      {(postReq.status === 'error' || commentReq.status === 'error') && (
        <ErrorLoader
          type="script-error"
          title={t(`There was an error loading the ${itemTypeName}`)}
          details={t(`We cannot show this ${itemTypeName} now`)}
          devDetails={postReq.error}
        />
      )}
      {(postReq.status === 'success' || commentReq.status === 'success') && (
        <>
          {itemData.moderated && itemData.delisted && (
            <EntryCardHidden
              moderatedContentLabel={t('This content has been moderated')}
              isDelisted={true}
            />
          )}
          {!itemData.moderated && isReported && (
            <EntryCardHidden
              reason={itemData.reason}
              headerTextLabel={t(`You reported this ${itemTypeName} for the following reason`)}
              footerTextLabel={t('It is awaiting moderation.')}
              ctaLabel={t('See it anyway')}
              handleFlipCard={handleFlipCard}
            />
          )}
          {!isReported && (
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
              flagAsLabel={t(`Report ${itemTypeName}`)}
              loggedProfileEthAddress={ethAddress}
              locale={locale || 'en'}
              style={{ height: 'auto', ...(style as React.CSSProperties) }}
              bookmarkLabel={t('Save')}
              bookmarkedLabel={t('Saved')}
              profileAnchorLink={'/profile'}
              repliesAnchorLink={'/social-app/post'}
              onRepost={onRepost}
              onEntryFlag={onFlag && onFlag(itemData.entryId, itemTypeName)}
              handleFollowAuthor={handleFollow}
              handleUnfollowAuthor={handleUnfollow}
              isFollowingAuthor={isFollowing}
              onContentClick={handleContentClick}
              onMentionClick={handleMentionClick}
              onTagClick={handleTagClick}
              singleSpaNavigate={singleSpaNavigate}
              contentClickable={contentClickable}
              moderatedContentLabel={t('This content has been moderated')}
              ctaLabel={t('See it anyway')}
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
  );
};

export default EntryRenderer;

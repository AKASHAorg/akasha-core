import React from 'react';
import DS from '@akashaproject/design-system';
import { useTranslation } from 'react-i18next';
import { useIsFollowingMultiple } from '@akashaproject/ui-awf-hooks/lib/use-follow.new';
import { EventTypes, ItemTypes } from '@akashaproject/ui-awf-typings/lib/app-loader';
import { IEntryData } from '@akashaproject/ui-awf-typings/lib/entry';
import { usePost } from '@akashaproject/ui-awf-hooks/lib/use-posts.new';
import { useComment } from '@akashaproject/ui-awf-hooks/lib/use-comments.new';
import { mapEntry } from '@akashaproject/ui-awf-hooks/lib/utils/entry-utils';
import { ILogger } from '@akashaproject/sdk-typings/lib/interfaces/log';
import { RootComponentProps } from '@akashaproject/ui-awf-typings';
import { ILocale } from '@akashaproject/design-system/lib/utils/time';
import ExtensionPoint from '@akashaproject/design-system/lib/utils/extension-point';
import { IContentClickDetails } from '@akashaproject/design-system/lib/components/EntryCard/entry-box';

const { ErrorLoader, EntryCard, EntryCardHidden, EntryCardLoading } = DS;

export interface NavigationDetails {
  authorEthAddress: string;
  entryId: string;
  replyTo: {
    authorEthAddress?: string;
    entryId: string;
  } | null;
}

export interface IEntryCardRendererProps {
  logger: ILogger;
  singleSpa: RootComponentProps['singleSpa'];
  itemId?: string;
  itemData?: IEntryData;
  isBookmarked?: boolean;
  locale?: ILocale;
  ethAddress?: string | null;
  onBookmark: (entryId: string) => void;
  onNavigate: (itemType: ItemTypes, details: IContentClickDetails) => void;
  onLinkCopy?: () => void;
  onRepost: (withComment: boolean, entryId: string) => void;
  sharePostUrl: string;
  onAvatarClick: (ev: React.MouseEvent<HTMLDivElement>, authorEth: string) => void;
  onMentionClick: (ethAddress: string) => void;
  onTagClick: (name: string) => void;
  bookmarks?: { entryId: string; type: ItemTypes }[];
  style?: React.CSSProperties;
  contentClickable?: boolean;
  disableReposting?: boolean;
  moderatedContentLabel?: string;
  ctaLabel?: string;
  handleFlipCard?: (entry: IEntryData, isQuote: boolean) => () => void;
  uiEvents: RootComponentProps['uiEvents'];
  navigateToModal: RootComponentProps['navigateToModal'];
}

const EntryCardRenderer = (props: IEntryCardRendererProps) => {
  const { ethAddress, locale, bookmarks, itemId, style, contentClickable, disableReposting } =
    props;

  const [showAnyway, setShowAnyway] = React.useState<boolean>(false);
  const { t } = useTranslation();
  const type = React.useMemo(() => {
    if (bookmarks) {
      return bookmarks.find(b => b.entryId === itemId).type;
    }
    return undefined;
  }, [bookmarks, itemId]);

  const postReq = usePost({ postId: itemId, enabler: type === ItemTypes.ENTRY });
  const commentReq = useComment(itemId, type === ItemTypes.COMMENT);

  const handleFlipCard = () => {
    setShowAnyway(true);
  };

  const handleClickAvatar = () => {
    props.onNavigate(ItemTypes.PROFILE, {
      entryId: itemData?.author.pubKey,
      authorEthAddress: itemData?.author.ethAddress,
      replyTo: null,
    });
  };

  const handleContentClick = () => {
    props.onNavigate(type, {
      entryId: itemData.entryId,
      authorEthAddress: itemData.author.ethAddress,
      replyTo: null,
    });
  };

  const itemData = React.useMemo(() => {
    if (type === ItemTypes.COMMENT && commentReq.isSuccess) {
      return mapEntry(commentReq.data);
    } else if (type === ItemTypes.ENTRY && postReq.isSuccess) {
      return mapEntry(postReq.data);
    }
  }, [type, postReq.data, postReq.isSuccess, commentReq.data, commentReq.isSuccess]);

  const [isReported, isAccountReported] = React.useMemo(() => {
    if (showAnyway) {
      return [false, false];
    }
    const reqSuccess = postReq.isSuccess || commentReq.isSuccess;
    return [reqSuccess && itemData?.reported, reqSuccess && itemData?.author?.reported];
  }, [itemData, showAnyway, postReq.isSuccess, commentReq.isSuccess]);

  const accountAwaitingModeration = !itemData?.author?.moderated && isAccountReported;
  const entryAwaitingModeration = !itemData?.moderated && isReported;

  const itemTypeName = React.useMemo(() => {
    switch (type) {
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
  }, [t, type]);

  const reportedTypeName = React.useMemo(() => {
    if (accountAwaitingModeration) return t(`the author of this ${itemTypeName}`);
    return t(`this ${itemTypeName}`);
  }, [t, accountAwaitingModeration, itemTypeName]);

  const onEditButtonMount = (name: string) => {
    props.uiEvents.next({
      event: EventTypes.ExtensionPointMount,
      data: {
        name,
        entryId: itemId,
        entryType: type,
      },
    });
  };

  const onEditButtonUnmount = () => {
    /* todo */
  };

  const handleEntryRemove = (entryId: string) => {
    if (entryId)
      props.navigateToModal({
        name: 'entry-remove-confirmation',
        entryType: ItemTypes.ENTRY,
        entryId,
      });
  };

  const handleEntryFlag = (entryId: string, itemType: string) => () => {
    if (entryId) props.navigateToModal({ name: 'report-modal', entryId, itemType });
  };

  const isFollowing = useIsFollowingMultiple(ethAddress, [itemData?.author?.ethAddress]);

  const handleFollow = () => {
    /* todo */
  };

  const handleUnfollow = () => {
    /* todo */
  };

  return (
    <>
      {(postReq.isError || commentReq.isError) && (
        <ErrorLoader
          type="script-error"
          title={t('There was an error loading the entry')}
          details={t('We cannot show this entry right now')}
          devDetails={postReq.error || commentReq.error}
        />
      )}
      {(postReq.isSuccess || commentReq.isSuccess) && (
        <>
          {(postReq.isLoading || commentReq.isLoading) && <EntryCardLoading />}
          {itemData && itemData.author?.ethAddress && (
            <>
              {itemData.moderated && itemData.delisted && (
                <EntryCardHidden
                  moderatedContentLabel={t('This content has been moderated')}
                  isDelisted={true}
                />
              )}
              {(accountAwaitingModeration || entryAwaitingModeration) && (
                <EntryCardHidden
                  reason={entryAwaitingModeration ? itemData.reason : itemData.author?.reason}
                  headerTextLabel={t(`You reported ${reportedTypeName} for the following reason`)}
                  footerTextLabel={t('It is awaiting moderation.')}
                  ctaLabel={t('See it anyway')}
                  handleFlipCard={handleFlipCard}
                />
              )}

              {!entryAwaitingModeration && !accountAwaitingModeration && (
                <EntryCard
                  isRemoved={itemData.isRemoved}
                  isBookmarked={true}
                  entryData={itemData}
                  sharePostLabel={t('Share Post')}
                  shareTextLabel={t('Share this post with your friends')}
                  sharePostUrl={props.sharePostUrl}
                  onClickAvatar={handleClickAvatar}
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
                  moderatedContentLabel={t('This content has been moderated')}
                  profileAnchorLink={'/profile'}
                  repliesAnchorLink={'/social-app/post'}
                  onRepost={props.onRepost}
                  handleFollowAuthor={handleFollow}
                  handleUnfollowAuthor={handleUnfollow}
                  isFollowingAuthor={isFollowing.data?.includes(ethAddress)}
                  onContentClick={handleContentClick}
                  onMentionClick={props.onMentionClick}
                  onTagClick={props.onTagClick}
                  singleSpaNavigate={props.singleSpa.navigateToUrl}
                  contentClickable={contentClickable}
                  disableReposting={disableReposting}
                  removeEntryLabel={t('Delete Post')}
                  onEntryRemove={handleEntryRemove}
                  onEntryFlag={handleEntryFlag(itemData.entryId, 'post')}
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
    </>
  );
};

export default EntryCardRenderer;

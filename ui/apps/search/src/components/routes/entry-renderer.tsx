import React from 'react';
import DS from '@akashaproject/design-system';
import { useTranslation } from 'react-i18next';
import { EventTypes, ItemTypes } from '@akashaproject/ui-awf-typings/lib/app-loader';
import { IEntryData } from '@akashaproject/ui-awf-typings/lib/entry';
import { ILogger } from '@akashaproject/sdk-typings/lib/interfaces/log';
import { RootComponentProps } from '@akashaproject/ui-awf-typings';
import { ILocale } from '@akashaproject/design-system/lib/utils/time';
import { IContentClickDetails } from '@akashaproject/design-system/lib/components/EntryCard/entry-box';
import { useGetBookmarks, useIsFollowingMultiple } from '@akashaproject/ui-awf-hooks';

const { EntryCard, EntryCardHidden, ExtensionPoint } = DS;

export interface IEntryCardRendererProps {
  logger: ILogger;
  singleSpa: RootComponentProps['singleSpa'];
  itemData?: IEntryData;
  itemType?: ItemTypes;
  isBookmarked?: boolean;
  locale?: ILocale;
  ethAddress?: string | null;
  onBookmark: (isBookmarked: boolean, entryId: string, itemType: ItemTypes) => void;
  bookmarksQuery: ReturnType<typeof useGetBookmarks>;
  onNavigate: (details: IContentClickDetails, itemType: ItemTypes) => void;
  onLinkCopy?: () => void;
  onRepost: (withComment: boolean, entryId: string) => void;
  sharePostUrl: string;
  onAvatarClick: (ev: React.MouseEvent<HTMLDivElement>, authorEth: string) => void;
  onMentionClick: (ethAddress: string) => void;
  onTagClick: (name: string) => void;
  style?: React.CSSProperties;
  contentClickable?: boolean;
  moderatedContentLabel?: string;
  ctaLabel?: string;
  handleFlipCard?: (entry: IEntryData, isQuote: boolean) => () => void;
  uiEvents: RootComponentProps['uiEvents'];
  navigateToModal: RootComponentProps['navigateToModal'];
  modalSlotId: string;
}

const EntryCardRenderer = (props: IEntryCardRendererProps) => {
  const {
    ethAddress,
    locale,
    itemData,
    itemType,
    style,
    contentClickable,
    bookmarksQuery,
    onBookmark,
    onRepost,
    modalSlotId,
  } = props;

  const { entryId } = itemData || {};
  const [showAnyway, setShowAnyway] = React.useState<boolean>(false);
  const { t } = useTranslation();

  const isBookmarked = React.useMemo(() => {
    return (
      bookmarksQuery.isSuccess &&
      entryId &&
      Array.isArray(bookmarksQuery.data) &&
      bookmarksQuery.data.findIndex(bm => bm.entryId === entryId) >= 0
    );
  }, [bookmarksQuery, entryId]);

  const handleFlipCard = () => {
    setShowAnyway(true);
  };

  const handleClickAvatar = () => {
    props.onNavigate(
      {
        id: itemData?.author.pubKey,
        authorEthAddress: itemData?.author.ethAddress,
      },
      ItemTypes.PROFILE,
    );
  };

  const handleContentClick = () => {
    props.onNavigate(
      {
        id: itemData.entryId,
        authorEthAddress: itemData.author.ethAddress,
        replyTo: itemData.postId ? { entryId: itemData.postId } : null,
      },
      itemType,
    );
  };

  const [isReported, isAccountReported] = React.useMemo(() => {
    if (showAnyway) {
      return [false, false];
    }
    return [itemData?.reported, itemData?.author?.reported];
  }, [itemData, showAnyway]);

  const accountAwaitingModeration = !itemData?.author?.moderated && isAccountReported;
  const entryAwaitingModeration = !itemData?.moderated && isReported;

  const itemTypeName = React.useMemo(() => {
    switch (itemType) {
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
  }, [t, itemType]);

  const hiddenEntryTextLabel = React.useMemo(() => {
    const stringEnd = `${itemTypeName} ${t('for the following reason')}`;
    if (accountAwaitingModeration) return `${t('You reported the author of this')} ${stringEnd}`;
    return `${t('You reported this')} ${stringEnd}}`;
  }, [t, accountAwaitingModeration, itemTypeName]);

  const onEditButtonMount = (name: string) => {
    props.uiEvents.next({
      event: EventTypes.ExtensionPointMount,
      data: {
        name,
        entryId,
        entryType: itemType,
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

  const handleEntryBookmark = (entryId: string) => {
    onBookmark(isBookmarked, entryId, itemType);
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

  const handleRepost = () => {
    if (onRepost) {
      onRepost(false, entryId);
    }
  };

  const hideActionButtons = React.useMemo(() => itemType === ItemTypes.COMMENT, [itemType]);

  return (
    <>
      {itemData && itemData.author?.ethAddress && (
        <div style={{ marginBottom: '8px' }}>
          {(accountAwaitingModeration || entryAwaitingModeration) && (
            <EntryCardHidden
              reason={entryAwaitingModeration ? itemData.reason : itemData.author?.reason}
              headerTextLabel={hiddenEntryTextLabel}
              footerTextLabel={t('It is awaiting moderation.')}
              ctaLabel={t('See it anyway')}
              handleFlipCard={handleFlipCard}
            />
          )}

          {!entryAwaitingModeration &&
            !accountAwaitingModeration &&
            !itemData.delisted &&
            !itemData.isRemoved && (
              <EntryCard
                isRemoved={itemData.isRemoved}
                isBookmarked={isBookmarked}
                entryData={itemData}
                sharePostLabel={t('Share Post')}
                shareTextLabel={t('Share this post with your friends')}
                sharePostUrl={props.sharePostUrl}
                onClickAvatar={handleClickAvatar}
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
                moderatedContentLabel={t('This content has been moderated')}
                showMore={true}
                profileAnchorLink={'/profile'}
                repliesAnchorLink={'/social-app/post'}
                onRepost={handleRepost}
                handleFollowAuthor={handleFollow}
                handleUnfollowAuthor={handleUnfollow}
                isFollowingAuthor={isFollowing.data?.includes(ethAddress)}
                onContentClick={handleContentClick}
                onMentionClick={props.onMentionClick}
                onTagClick={props.onTagClick}
                singleSpaNavigate={props.singleSpa.navigateToUrl}
                contentClickable={contentClickable}
                disableReposting={itemData.isRemoved}
                removeEntryLabel={t('Delete Post')}
                onEntryRemove={handleEntryRemove}
                onEntryFlag={handleEntryFlag(itemData.entryId, 'post')}
                hideActionButtons={hideActionButtons}
                modalSlotId={modalSlotId}
                headerMenuExt={
                  ethAddress === itemData.author.ethAddress && (
                    <ExtensionPoint
                      style={{ width: '100%' }}
                      name={`entry-card-edit-button_${entryId}`}
                      onMount={onEditButtonMount}
                      onUnmount={onEditButtonUnmount}
                    />
                  )
                }
              />
            )}
        </div>
      )}
    </>
  );
};

export default EntryCardRenderer;

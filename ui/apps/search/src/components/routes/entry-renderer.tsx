import React from 'react';
import DS from '@akashaorg/design-system';
import { useTranslation } from 'react-i18next';
import {
  EventTypes,
  EntityTypes,
  ModalNavigationOptions,
  IEntryData,
  NavigateToParams,
  RootComponentProps,
} from '@akashaorg/typings/ui';
import { Logger } from '@akashaorg/awf-sdk';
import { ILocale } from '@akashaorg/design-system/lib/utils/time';
import { IContentClickDetails } from '@akashaorg/design-system/lib/components/EntryCard/entry-box';
import { useIsFollowingMultiple } from '@akashaorg/ui-awf-hooks';

const { EntryCard, EntryCardHidden, ExtensionPoint } = DS;

export interface IEntryCardRendererProps {
  logger: Logger;
  singleSpa: RootComponentProps['singleSpa'];
  itemData?: IEntryData;
  itemType?: EntityTypes;
  locale?: ILocale;
  ethAddress?: string | null;
  pubKey?: string;
  navigateTo?: (args: NavigateToParams) => void;
  onContentClick: (details: IContentClickDetails, itemType: EntityTypes) => void;
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
    pubKey,
    locale,
    itemData,
    itemType,
    style,
    contentClickable,
    onRepost,
    modalSlotId,
    navigateTo,
  } = props;

  const { entryId } = itemData || {};
  const [showAnyway, setShowAnyway] = React.useState<boolean>(false);
  const { t } = useTranslation('app-search');

  const handleFlipCard = () => {
    setShowAnyway(true);
  };

  const handleClickAvatar = () => {
    navigateTo?.({
      appName: '@akashaorg/app-profile',
      getNavigationUrl: navRoutes => `${navRoutes.rootRoute}/${itemData?.author.pubKey}`,
    });
  };

  const handleContentClick = () => {
    props.onContentClick(
      {
        id: itemData.entryId,
        authorEthAddress: itemData.author.ethAddress,
        replyTo: itemData.postId ? { itemId: itemData.postId } : null,
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
      case EntityTypes.ENTRY:
        return t('post');
      case EntityTypes.PROFILE:
        return t('account');
      case EntityTypes.COMMENT:
        return t('reply');
      case EntityTypes.TAG:
        return t('tag');
      default:
        return t('unknown');
    }
  }, [t, itemType]);

  const handleExtPointMount = (name: string) => {
    props.uiEvents.next({
      event: EventTypes.ExtensionPointMount,
      data: {
        name,
        itemId: entryId,
        itemType: itemType,
      },
    });
  };

  const handleExtPointUnmount = () => {
    /* todo */
  };

  const handleEntryRemove = (itemId: string) => {
    if (itemId)
      props.navigateToModal({
        name: 'entry-remove-confirmation',
        itemType: EntityTypes.ENTRY,
        itemId,
      });
  };

  const showLoginModal = (redirectTo?: { modal: ModalNavigationOptions }) => {
    props.navigateToModal({ name: 'login', redirectTo });
  };

  // why is itemType string here??
  const handleEntryFlag = (itemId: string, itemType: string) => () => {
    if (!ethAddress) {
      return showLoginModal({
        modal: { name: 'report-modal', itemId, itemType: itemType as unknown as EntityTypes },
      });
    }

    if (itemId)
      props.navigateToModal({
        name: 'report-modal',
        itemId,
        itemType: itemType as unknown as EntityTypes,
      });
  };

  const isFollowing = useIsFollowingMultiple(pubKey, [itemData?.author?.pubKey]);

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

  const hideActionButtons = React.useMemo(() => itemType === EntityTypes.COMMENT, [itemType]);

  return (
    <>
      {itemData && itemData.author?.ethAddress && (
        <div style={{ marginBottom: '8px' }}>
          {(accountAwaitingModeration || entryAwaitingModeration) && (
            <EntryCardHidden
              reason={entryAwaitingModeration ? itemData.reason : itemData.author?.reason}
              headerTextLabel={t(
                'You reported {{ isAuthorString }} {{ itemTypeName }} for the following reason',
                {
                  itemTypeName,
                  isAuthorString: accountAwaitingModeration ? 'the author of this' : 'this',
                },
              )}
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
                entryData={itemData}
                sharePostLabel={t('Share Post')}
                shareTextLabel={t('Share this post with your friends')}
                sharePostUrl={props.sharePostUrl}
                onClickAvatar={handleClickAvatar}
                repliesLabel={t('Replies')}
                repostLabel={t('Repost')}
                repostWithCommentLabel={t('Repost with comment')}
                shareLabel={t('Share')}
                copyLinkLabel={t('Copy Link')}
                flagAsLabel={t('Report Post')}
                loggedProfileEthAddress={ethAddress}
                locale={locale || 'en'}
                style={{ height: 'auto', ...style }}
                moderatedContentLabel={t('This content has been moderated')}
                showMore={true}
                profileAnchorLink={'/@akashaorg/app-profile'}
                repliesAnchorLink={`/@akashaorg/app-akasha-integration/${
                  itemType === EntityTypes.COMMENT ? 'reply' : 'post'
                }`}
                onRepost={handleRepost}
                handleFollowAuthor={handleFollow}
                handleUnfollowAuthor={handleUnfollow}
                isFollowingAuthor={isFollowing.data?.includes(ethAddress)}
                onContentClick={handleContentClick}
                onMentionClick={props.onMentionClick}
                onTagClick={props.onTagClick}
                navigateTo={props.navigateTo}
                contentClickable={contentClickable}
                disableReposting={itemData.isRemoved}
                removeEntryLabel={t('Delete Post')}
                onEntryRemove={handleEntryRemove}
                onEntryFlag={handleEntryFlag(itemData.entryId, 'post')}
                hideActionButtons={hideActionButtons}
                modalSlotId={modalSlotId}
                actionsRightExt={
                  <ExtensionPoint
                    name={`entry-card-actions-right_${entryId}`}
                    onMount={handleExtPointMount}
                    onUnmount={handleExtPointUnmount}
                  />
                }
                headerMenuExt={
                  ethAddress === itemData.author.ethAddress && (
                    <ExtensionPoint
                      style={{ width: '100%' }}
                      name={`entry-card-edit-button_${entryId}`}
                      onMount={handleExtPointMount}
                      onUnmount={handleExtPointUnmount}
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

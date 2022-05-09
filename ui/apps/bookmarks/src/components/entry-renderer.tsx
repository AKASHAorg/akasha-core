import React from 'react';
import DS from '@akashaorg/design-system';
import { useTranslation } from 'react-i18next';
import {
  useIsFollowingMultiple,
  usePost,
  useComment,
  mapEntry,
  LoginState,
} from '@akashaorg/ui-awf-hooks';
import { EventTypes, ItemTypes } from '@akashaorg/ui-awf-typings/lib/app-loader';
import { IEntryData } from '@akashaorg/ui-awf-typings/lib/entry';
import { ILogger } from '@akashaorg/sdk-typings/lib/interfaces/log';
import { NavigateToParams, RootComponentProps } from '@akashaorg/ui-awf-typings';
import { ILocale } from '@akashaorg/design-system/lib/utils/time';

const { ErrorLoader, EntryCard, EntryCardHidden, EntryCardLoading, ExtensionPoint } = DS;

export interface IEntryCardRendererProps {
  logger: ILogger;
  singleSpa: RootComponentProps['singleSpa'];
  itemId?: string;
  itemData?: IEntryData;
  locale?: ILocale;
  loginState: LoginState;
  navigateTo?: (args: NavigateToParams) => void;
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
  modalSlotId: string;
}

const EntryCardRenderer = (props: IEntryCardRendererProps) => {
  const {
    loginState,
    locale,
    bookmarks,
    itemId,
    style,
    contentClickable,
    disableReposting,
    modalSlotId,
    navigateTo,
  } = props;

  const [showAnyway, setShowAnyway] = React.useState<boolean>(false);
  const { t } = useTranslation('app-bookmarks');
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
    navigateTo?.({
      appName: '@akashaorg/app-profile',
      getNavigationUrl: navRoutes => `${navRoutes.Post}/${itemData?.author.pubKey}`,
    });
  };

  const handleContentClick = () => {
    navigateTo?.({
      appName: '@akashaorg/app-akasha-integration',
      getNavigationUrl: navRoutes => `${navRoutes.Post}/${itemData.entryId}`,
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

  const onExtPointMount = (name: string) => {
    props.uiEvents.next({
      event: EventTypes.ExtensionPointMount,
      data: {
        name,
        entryId: itemId,
        entryType: type,
      },
    });
  };

  const onExtPointUnmount = () => {
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

  const isFollowing = useIsFollowingMultiple(loginState.ethAddress, [itemData?.author?.ethAddress]);

  const handleFollow = () => {
    /* todo */
  };

  const handleUnfollow = () => {
    /* todo */
  };

  const showEditButton = React.useMemo(
    () => loginState.isReady && loginState.ethAddress === itemData?.author?.ethAddress,
    [itemData?.author?.ethAddress, loginState.ethAddress, loginState.isReady],
  );

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
              {!entryAwaitingModeration && !accountAwaitingModeration && !itemData.delisted && (
                <EntryCard
                  isRemoved={itemData.isRemoved}
                  entryData={itemData}
                  sharePostLabel={t('Share Post')}
                  shareTextLabel={t('Share this post with your friends')}
                  sharePostUrl={props.sharePostUrl}
                  onClickAvatar={handleClickAvatar}
                  repliesLabel={t('Replies')}
                  repostsLabel={t('Reposts')}
                  repostLabel={t('Repost')}
                  repostWithCommentLabel={t('Repost with comment')}
                  shareLabel={t('Share')}
                  copyLinkLabel={t('Copy Link')}
                  flagAsLabel={t('Report Post')}
                  loggedProfileEthAddress={loginState.isReady && loginState.ethAddress}
                  locale={locale || 'en'}
                  style={{ height: 'auto', ...style }}
                  moderatedContentLabel={t('This content has been moderated')}
                  editedLabel={t('Last edited')}
                  showMore={true}
                  profileAnchorLink={'/profile'}
                  repliesAnchorLink={'/social-app/post'}
                  onRepost={props.onRepost}
                  handleFollowAuthor={handleFollow}
                  handleUnfollowAuthor={handleUnfollow}
                  isFollowingAuthor={isFollowing.data?.includes(loginState.ethAddress)}
                  onContentClick={handleContentClick}
                  onMentionClick={props.onMentionClick}
                  onTagClick={props.onTagClick}
                  navigateTo={navigateTo}
                  contentClickable={contentClickable}
                  disableReposting={disableReposting}
                  removeEntryLabel={t('Delete Post')}
                  onEntryRemove={handleEntryRemove}
                  onEntryFlag={handleEntryFlag(itemData.entryId, 'post')}
                  modalSlotId={modalSlotId}
                  actionsRightExt={
                    <ExtensionPoint
                      name={`entry-card-actions-right_${itemId}`}
                      onMount={onExtPointMount}
                      onUnmount={onExtPointUnmount}
                    />
                  }
                  headerMenuExt={
                    showEditButton && (
                      <ExtensionPoint
                        style={{ width: '100%' }}
                        name={`entry-card-edit-button_${itemId}`}
                        onMount={onExtPointMount}
                        onUnmount={onExtPointUnmount}
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

import React from 'react';
import { useTranslation } from 'react-i18next';
import { i18n } from 'i18next';

import ErrorLoader from '@akashaorg/design-system-core/lib/components/ErrorLoader';
import EntryCard from '@akashaorg/design-system-components/lib/components/Entry/EntryCard';
import EntryCardHidden from '@akashaorg/design-system-components/lib/components/Entry/EntryCardHidden';
import EntryCardLoading from '@akashaorg/design-system-components/lib/components/Entry/EntryCardLoading';

import Extension from '@akashaorg/design-system-components/lib/components/Extension';
import Box from '@akashaorg/design-system-core/lib/components/Box';

import { ILogger } from '@akashaorg/typings/sdk/log';
import { ILocale } from '@akashaorg/design-system/lib/utils/time';
import { useInfiniteReplies } from '@akashaorg/ui-awf-hooks/lib/use-comments';
import {
  TrackEventData,
  EventTypes,
  EntityTypes,
  NavigateToParams,
  RootComponentProps,
  ModalNavigationOptions,
} from '@akashaorg/typings/ui';
import { usePost, useComment, mapEntry, useDummyQuery } from '@akashaorg/ui-awf-hooks';

import FeedWidget from './App';
import { Profile, IContentClickDetails } from '@akashaorg/typings/ui';

export interface IEntryRenderer {
  itemId?: string;
  itemSpacing?: number;
  sharePostUrl: string;
  locale: ILocale;
  style?: React.CSSProperties;
  onFlag?: (
    entryId: string,
    itemType: EntityTypes,
    reporterEthAddress?: string | null,
  ) => () => void;
  onRepost: (withComment: boolean, entryId: string) => void;
  onEntryNavigate: (details: IContentClickDetails, itemType: EntityTypes) => void;
  navigateTo: (args: NavigateToParams) => void;
  contentClickable?: boolean;
  itemType: EntityTypes;
  onEntryRemove?: (entryId: string) => void;
  parentIsProfilePage?: boolean;
  removeEntryLabel?: string;
  removedByMeLabel?: string;
  removedByAuthorLabel?: string;
  uiEvents: RootComponentProps['uiEvents'];
  className?: string;
  modalSlotId: string;
  accentBorderTop?: boolean;
  trackEvent?: (event: Omit<TrackEventData, 'eventType'>) => void;
  index?: number;
  totalEntry?: number;
  logger: ILogger;
  onLoginModalOpen: (redirectTo?: { modal: ModalNavigationOptions }) => void;
  navigateToModal: (props: ModalNavigationOptions) => void;
  loggedProfileData?: Profile;
  i18n: i18n;
}

const REPLY_FRAGMENT_SIZE = 2;

const EntryRenderer = (
  props: IEntryRenderer & { replyFragmentItem: boolean; showReplyFragment: boolean },
) => {
  const {
    locale,
    itemId,
    itemType,
    style,
    onFlag,
    onEntryNavigate,
    navigateTo,
    onRepost,
    contentClickable,
    parentIsProfilePage,
    accentBorderTop,
    itemSpacing,
    loggedProfileData,
    replyFragmentItem,
    uiEvents,
    showReplyFragment,
    index,
    totalEntry,
    className,
    onEntryRemove,
    removeEntryLabel,
    removedByMeLabel,
    removedByAuthorLabel,
    modalSlotId,
    logger,
    navigateToModal,
    onLoginModalOpen,
    trackEvent,
    i18n,
  } = props;

  const [showAnyway, setShowAnyway] = React.useState<boolean>(false);

  const { t } = useTranslation('ui-lib-feed');

  const postReq = useDummyQuery({ postId: itemId, enabler: itemType === EntityTypes.POST });
  const commentReq = useComment(itemId, itemType === EntityTypes.REPLY);

  const postData = React.useMemo(() => {
    if (postReq.data && itemType === EntityTypes.POST) {
      return mapEntry(postReq.data);
    }
    return undefined;
  }, [postReq.data, itemType]);

  const commentData = React.useMemo(() => {
    if (commentReq.data && itemType === EntityTypes.REPLY) {
      return mapEntry(commentReq.data);
    }
    return undefined;
  }, [commentReq.data, itemType]);

  // @TODO fix hooks
  const itemData = React.useMemo(() => {
    if (itemType === EntityTypes.POST) {
      return postData;
    } else if (itemType === EntityTypes.REPLY) {
      return commentData;
    }
  }, [postData, commentData, itemType]);

  const [isReported, isAccountReported] = React.useMemo(() => {
    if (showAnyway) {
      return [false, false];
    }
    const reqSuccess = postReq.isSuccess || commentReq.isSuccess;
    return [reqSuccess && itemData?.reported, reqSuccess && itemData?.author?.reported];
  }, [itemData, showAnyway, postReq.isSuccess, commentReq.isSuccess]);

  const handleAvatarClick = () => {
    navigateTo?.({
      appName: '@akashaorg/app-profile',
      getNavigationUrl: navRoutes => `${navRoutes.rootRoute}/${itemData?.author.pubKey}`,
    });
  };

  const handleContentClick = (details: IContentClickDetails) => {
    onEntryNavigate(details, itemType);
  };

  const handleMentionClick = (pubKey: string) => {
    navigateTo?.({
      appName: '@akashaorg/app-profile',
      getNavigationUrl: navRoutes => `${navRoutes.rootRoute}/${pubKey}`,
    });
  };

  const handleTagClick = (name: string) => {
    navigateTo?.({
      appName: '@akashaorg/app-akasha-integration',
      getNavigationUrl: navRoutes => `${navRoutes.Tags}/${name}`,
    });
  };

  const handleExtensionMount = (name: string) => {
    uiEvents.next({
      event: EventTypes.ExtensionPointMount,
      data: {
        name,
        itemId,
        itemType,
        hideLabel: itemType === EntityTypes.POST,
      },
    });
  };

  const handleExtensionUnmount = (name: string) => {
    uiEvents.next({
      event: EventTypes.ExtensionPointUnmount,
      data: {
        name,
        itemId,
        itemType,
      },
    });
  };
  const handleFlipCard = () => {
    setShowAnyway(true);
  };

  const itemTypeName = React.useMemo(() => {
    switch (itemType) {
      case EntityTypes.POST:
        return t('post');
      case EntityTypes.PROFILE:
        return t('account');
      case EntityTypes.REPLY:
        return t('reply');
      case EntityTypes.TAG:
        return t('tag');
      default:
        return t('unknown');
    }
  }, [t, itemType]);

  const accountAwaitingModeration =
    !itemData?.author?.moderated && isAccountReported && !parentIsProfilePage;
  const entryAwaitingModeration = !itemData?.moderated && isReported;

  const reportedTypeName = React.useMemo(() => {
    if (accountAwaitingModeration) return `the author of this ${itemTypeName}`;
    return `this ${itemTypeName}`;
  }, [accountAwaitingModeration, itemTypeName]);
  // @TODO fix author
  const showEditButton = React.useMemo(
    () => false, //loggedProfileData?.did.id === itemData?.author?.did.id,
    [itemData?.author, loggedProfileData],
  );

  const isComment = React.useMemo(() => itemType === EntityTypes.REPLY, [itemType]);

  const canShowEntry =
    itemData &&
    !entryAwaitingModeration &&
    !accountAwaitingModeration &&
    !itemData.delisted &&
    !itemData.isRemoved;
  const repliesReq = useInfiniteReplies(
    {
      limit: REPLY_FRAGMENT_SIZE,
      postID: !!commentData && 'postId' in commentData && commentData?.postId,
      commentID: commentData?.entryId,
    },
    Boolean(canShowEntry) && showReplyFragment,
  );

  const replyPages = React.useMemo(() => {
    if (repliesReq.data) {
      return repliesReq.data.pages;
    }
    return [];
  }, [repliesReq.data]);

  const entryCardStyle = () => {
    if (!isComment) return '';

    if (replyFragmentItem) return;
    `ml-6 border-l-1 border(grey8 dark:grey3)`;

    if (index !== totalEntry) return;
    `border-b-1 border(grey8 dark:grey3)`;
  };

  const entryLoading = postReq.isLoading || commentReq.isLoading;

  const hasItemSpacingStyle = React.useMemo(
    () => itemSpacing && (entryLoading || canShowEntry),
    [itemSpacing, entryLoading, canShowEntry],
  );

  return (
    <Box customStyle={hasItemSpacingStyle ? `mb-[${itemSpacing}px]` : ''}>
      {entryLoading && <EntryCardLoading />}
      {(postReq.isError || commentReq.isError) && (
        <ErrorLoader
          type="script-error"
          title={t('There was an error loading the {{itemTypeName}}', { itemTypeName })}
          details={t('We cannot show this {{itemTypeName}} now', { itemTypeName })}
          devDetails={(postReq.error as Error).message}
        />
      )}
      {(postReq.isSuccess || commentReq.isSuccess) && (
        <>
          {(accountAwaitingModeration || entryAwaitingModeration) && (
            <EntryCardHidden
              reason={entryAwaitingModeration ? itemData.reason : itemData.author?.reason}
              headerTextLabel={t('You reported {{reportedTypeName}} for the following reason', {
                reportedTypeName,
              })}
              footerTextLabel={t('It is awaiting moderation.')}
              ctaLabel={t('See it anyway')}
              handleFlipCard={handleFlipCard}
            />
          )}
          {canShowEntry && (
            <Box customStyle={entryCardStyle()}>
              <EntryCard
                className={className}
                isRemoved={itemData.isRemoved}
                entryData={{ ...itemData, author: itemData.author as unknown as Profile }}
                onClickAvatar={handleAvatarClick}
                editedLabel={t('Last edited')}
                flagAsLabel={t('Report {{itemTypeName}}', { itemTypeName })}
                locale={locale || 'en'}
                style={{
                  ...(style as React.CSSProperties),
                }}
                showMore={true}
                profileAnchorLink={'/@akashaorg/app-profile'}
                repliesAnchorLink={`/@akashaorg/app-akasha-integration/${
                  isComment ? 'reply' : 'post'
                }`}
                hideRepost={isComment}
                onRepost={onRepost}
                onEntryFlag={onFlag && onFlag(itemData.entryId, itemType)}
                onContentClick={handleContentClick}
                onMentionClick={handleMentionClick}
                onTagClick={handleTagClick}
                navigateTo={navigateTo}
                contentClickable={contentClickable}
                moderatedContentLabel={t('This content has been moderated')}
                ctaLabel={t('See it anyway')}
                handleFlipCard={handleFlipCard}
                onEntryRemove={onEntryRemove}
                removeEntryLabel={removeEntryLabel}
                removedByMeLabel={removedByMeLabel}
                removedByAuthorLabel={removedByAuthorLabel}
                disableReposting={itemData.isRemoved || isComment}
                disableReporting={!loggedProfileData?.did?.id}
                border={!isComment}
                accentBorderTop={accentBorderTop}
                actionsRightExt={
                  !isComment && (
                    <Extension name={`entry-card-actions-right_${itemId}`} uiEvents={uiEvents} />
                  )
                }
                headerMenuExt={
                  showEditButton && (
                    <Extension name={`entry-card-edit-button_${itemId}`} uiEvents={uiEvents} />
                  )
                }
              />

              {showReplyFragment && (
                <Box customStyle={replyPages.length ? `mb-1` : ''} data-testid="reply-fragment">
                  <FeedWidget
                    modalSlotId={modalSlotId}
                    pages={replyPages}
                    logger={logger}
                    itemType={EntityTypes.REPLY}
                    onLoadMore={() => ({})}
                    getShareUrl={(itemId: string) =>
                      `${window.location.origin}/@akashaorg/app-akasha-integration/reply/${itemId}`
                    }
                    viewAllEntry={{
                      label: 'View all replies',
                      onClick: () => {
                        props.navigateTo?.({
                          appName: '@akashaorg/app-akasha-integration',
                          getNavigationUrl: navRoutes =>
                            `${navRoutes.Reply}/${commentData?.entryId}`,
                        });
                      },
                      limit: REPLY_FRAGMENT_SIZE,
                    }}
                    navigateTo={navigateTo}
                    navigateToModal={navigateToModal}
                    requestStatus={repliesReq.status}
                    hasNextPage={repliesReq.hasNextPage}
                    loggedProfileData={loggedProfileData}
                    contentClickable={true}
                    onEntryFlag={onFlag}
                    onEntryRemove={onEntryRemove}
                    removeEntryLabel={t('Delete Reply')}
                    removedByMeLabel={t('You deleted this reply')}
                    removedByAuthorLabel={t('This reply was deleted by its author')}
                    uiEvents={uiEvents}
                    itemSpacing={8}
                    i18n={i18n}
                    trackEvent={trackEvent}
                    onLoginModalOpen={onLoginModalOpen}
                    replyFragmentItem={true}
                  />
                </Box>
              )}
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default React.memo(EntryRenderer);

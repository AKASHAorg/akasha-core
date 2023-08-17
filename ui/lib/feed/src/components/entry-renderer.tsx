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
import { ILocale } from '@akashaorg/design-system-core/lib/utils/time';

import {
  TrackEventData,
  EventTypes,
  EntityTypes,
  NavigateToParams,
  RootComponentProps,
  ModalNavigationOptions,
} from '@akashaorg/typings/ui';

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

  const postData = [];

  // @TODO fix hooks
  const itemData = [];

  const [isReported, isAccountReported] = React.useMemo(() => {
    if (showAnyway) {
      return [false, false];
    }
    return [false, false];
  }, [showAnyway]);

  const handleAvatarClick = () => {
    navigateTo?.({
      appName: '@akashaorg/app-profile',
      getNavigationUrl: navRoutes => `${navRoutes.rootRoute}/itemData?.author.pubKey`,
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

  const accountAwaitingModeration = false;
  const entryAwaitingModeration = false;

  const reportedTypeName = React.useMemo(() => {
    if (accountAwaitingModeration) return `the author of this ${itemTypeName}`;
    return `this ${itemTypeName}`;
  }, [accountAwaitingModeration, itemTypeName]);
  // @TODO fix author
  const showEditButton = React.useMemo(
    () => false, //loggedProfileData?.did.id === itemData?.author?.did.id,
    [loggedProfileData],
  );

  const isComment = React.useMemo(() => itemType === EntityTypes.REPLY, [itemType]);

  const canShowEntry = true;
  const repliesReq = undefined;

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

  const entryLoading = false;

  const hasItemSpacingStyle = React.useMemo(
    () => itemSpacing && (entryLoading || canShowEntry),
    [itemSpacing, entryLoading, canShowEntry],
  );

  return (
    <Box customStyle={hasItemSpacingStyle ? `mb-[${itemSpacing}px]` : ''}>
      {entryLoading && <EntryCardLoading />}
      {false && (
        <ErrorLoader
          type="script-error"
          title={t('There was an error loading the {{itemTypeName}}', { itemTypeName })}
          details={t('We cannot show this {{itemTypeName}} now', { itemTypeName })}
          devDetails={'placeholder'}
        />
      )}
      {
        <>
          {(accountAwaitingModeration || entryAwaitingModeration) && (
            <EntryCardHidden
              reason={'placeholder'}
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
                isRemoved={false}
                entryData={undefined}
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
                onEntryFlag={undefined}
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
                disableReposting={false}
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
                          getNavigationUrl: navRoutes => `${navRoutes.Reply}/commentData?.entryId`,
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
      }
    </Box>
  );
};

export default React.memo(EntryRenderer);

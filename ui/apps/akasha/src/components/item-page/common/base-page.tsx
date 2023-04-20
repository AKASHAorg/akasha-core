import React from 'react';
import { UseQueryResult } from 'react-query';
import { useTranslation } from 'react-i18next';

import ErrorLoader from '@akashaorg/design-system-core/lib/components/ErrorLoader';
import EntryCardHidden from '@akashaorg/design-system-components/lib/components/Entry/EntryCardHidden';
import EntryCardLoading from '@akashaorg/design-system-components/lib/components/Entry/EntryCardLoading';
import BasicCardBox from '@akashaorg/design-system-core/lib/components/BasicCardBox';
import { Logger } from '@akashaorg/awf-sdk';
import { useAnalytics } from '@akashaorg/ui-awf-hooks';
import FeedWidget from '@akashaorg/ui-lib-feed/lib/components/App';
import { LoginState, useInfiniteComments, useGetProfile } from '@akashaorg/ui-awf-hooks';
import { useInfiniteReplies } from '@akashaorg/ui-awf-hooks/lib/use-comments';
import {
  RootComponentProps,
  EntityTypes,
  ModalNavigationOptions,
  IEntryData,
} from '@akashaorg/typings/ui';

import { OriginalItem } from './original-item';
import { PendingReply } from './pending-reply';

type BaseEntryProps = {
  postId: string;
  commentId?: string;
  itemType: EntityTypes;
  entryReq: UseQueryResult;
  entryData?: IEntryData;
  logger: Logger;
  loginState?: LoginState;
  showLoginModal: (redirectTo?: { modal: ModalNavigationOptions }) => void;
};

const BaseEntryPage: React.FC<BaseEntryProps & RootComponentProps> = props => {
  const {
    postId,
    commentId,
    itemType,
    entryData,
    entryReq,
    showLoginModal,
    logger,
    loginState,
    children,
  } = props;
  const navigateTo = props.plugins['@akashaorg/app-routing']?.routing?.navigateTo;
  const [showAnyway, setShowAnyway] = React.useState<boolean>(false);
  const { t } = useTranslation('app-akasha-integration');

  const isReported = React.useMemo(() => {
    if (showAnyway) {
      return false;
    }
    return entryReq.isSuccess && entryData?.reported;
  }, [entryData?.reported, showAnyway, entryReq.isSuccess]);

  const reqComments = useInfiniteComments({ limit: 15, postID: postId }, !commentId);
  const reqReplies = useInfiniteReplies(
    { limit: 15, postID: postId, commentID: commentId },
    !!commentId,
  );
  const reqCommentsOrReplies = commentId ? reqReplies : reqComments;
  const [analyticsActions] = useAnalytics();

  const commentPages = React.useMemo(() => {
    if (reqCommentsOrReplies.data) {
      return reqCommentsOrReplies.data.pages;
    }
    return [];
  }, [reqCommentsOrReplies.data]);

  const profileDataReq = useGetProfile(loginState?.pubKey);
  const loggedProfileData = profileDataReq.data;

  const handleLoadMore = () => {
    if (
      reqCommentsOrReplies.isSuccess &&
      reqCommentsOrReplies.hasNextPage &&
      loginState?.fromCache
    ) {
      reqCommentsOrReplies.fetchNextPage();
    }
  };

  const handleEntryFlag = (itemId: string, itemType: EntityTypes) => () => {
    if (!loginState?.pubKey) {
      return showLoginModal({ modal: { name: 'report-modal', itemId, itemType } });
    }
    props.navigateToModal({ name: 'report-modal', itemId, itemType });
  };

  const handleFlipCard = () => {
    setShowAnyway(true);
  };

  const handleCommentRemove = (commentId: string) => {
    props.navigateToModal({
      name: 'entry-remove-confirmation',
      itemType: EntityTypes.REPLY,
      itemId: commentId,
    });
  };

  return (
    <BasicCardBox style={`h-auto overflow-hidden`} elevation="sm">
      {children}
      {entryReq.isLoading && <EntryCardLoading />}
      {entryReq.isError && (
        <ErrorLoader
          type="script-error"
          title={t('There was an error loading the entry')}
          details={t('We cannot show this entry right now')}
          devDetails={entryReq.error as string}
        />
      )}
      {entryReq.isSuccess && (
        <>
          {entryData?.moderated && entryData?.delisted && (
            <EntryCardHidden
              moderatedContentLabel={t('This content has been moderated')}
              isDelisted={true}
            />
          )}
          {!entryData?.moderated && isReported && (
            <EntryCardHidden
              reason={entryData?.reason}
              headerTextLabel={t('You reported this post for the following reason')}
              footerTextLabel={t('It is awaiting moderation.')}
              ctaLabel={t('See it anyway')}
              handleFlipCard={handleFlipCard}
            />
          )}
          <OriginalItem
            itemId={commentId || postId}
            itemType={itemType}
            entryReq={entryReq}
            loginState={loginState}
            uiEvents={props.uiEvents}
            plugins={props.plugins}
            layoutConfig={props.layoutConfig}
            entryData={entryData}
            navigateToModal={props.navigateToModal}
            showLoginModal={props.showLoginModal}
          />
          <PendingReply
            postId={postId}
            loggedProfileData={loggedProfileData}
            commentIds={commentPages[0]?.results || []}
          />
          <FeedWidget
            modalSlotId={props.layoutConfig.modalSlotId}
            logger={logger}
            pages={commentPages}
            itemType={EntityTypes.REPLY}
            onLoadMore={handleLoadMore}
            getShareUrl={(itemId: string) =>
              `${window.location.origin}/@akashaorg/app-akasha-integration/reply/${itemId}`
            }
            loginState={loginState}
            navigateTo={navigateTo}
            navigateToModal={props.navigateToModal}
            onLoginModalOpen={showLoginModal}
            requestStatus={reqCommentsOrReplies.status}
            hasNextPage={reqCommentsOrReplies.hasNextPage}
            loggedProfile={loggedProfileData}
            contentClickable={true}
            onEntryFlag={handleEntryFlag}
            onEntryRemove={handleCommentRemove}
            removeEntryLabel={t('Delete Reply')}
            removedByMeLabel={t('You deleted this reply')}
            removedByAuthorLabel={t('This reply was deleted by its author')}
            uiEvents={props.uiEvents}
            itemSpacing={8}
            i18n={props.plugins['@akashaorg/app-translation']?.translation?.i18n}
            trackEvent={analyticsActions.trackEvent}
            showReplyFragment={true}
          />
        </>
      )}
    </BasicCardBox>
  );
};

export default BaseEntryPage;

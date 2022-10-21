import * as React from 'react';
import { useTranslation } from 'react-i18next';

import DS from '@akashaorg/design-system';
import {
  RootComponentProps,
  EntityTypes,
  ModalNavigationOptions,
  IEntryData,
} from '@akashaorg/typings/ui';

import { LoginState, useInfiniteComments, useGetProfile } from '@akashaorg/ui-awf-hooks';

import FeedWidget from '@akashaorg/ui-lib-feed/lib/components/App';
import { useAnalytics } from '@akashaorg/ui-awf-hooks';
import { Entry } from './entry';
import { PendingReply } from './pending-reply';
import { UseQueryResult } from 'react-query';
import { ILogger } from '@akashaorg/typings/sdk';

const { BasicCardBox, EntryCardHidden, ErrorLoader, EntryCardLoading } = DS;

interface IBaseEntryProps {
  postId: string;
  replyTo?: string;
  entryType: EntityTypes;
  entryReq: UseQueryResult;
  entryData?: IEntryData;
  logger: ILogger;
  loginState?: LoginState;
  showLoginModal: (redirectTo?: { modal: ModalNavigationOptions }) => void;
}

const BaseEntryPage: React.FC<IBaseEntryProps & RootComponentProps> = props => {
  const {
    postId,
    replyTo,
    entryType,
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

  const reqComments = useInfiniteComments(15, replyTo || postId);
  const [analyticsActions] = useAnalytics();

  const commentPages = React.useMemo(() => {
    if (reqComments.data) {
      return reqComments.data.pages;
    }
    return [];
  }, [reqComments.data]);

  const profileDataReq = useGetProfile(loginState?.pubKey);
  const loggedProfileData = profileDataReq.data;

  const handleLoadMore = () => {
    if (reqComments.isSuccess && reqComments.hasNextPage && loginState?.fromCache) {
      reqComments.fetchNextPage();
    }
  };

  const handleEntryFlag = (entryId: string, itemType: string) => () => {
    if (!loginState?.pubKey) {
      return showLoginModal({ modal: { name: 'report-modal', entryId, itemType } });
    }
    props.navigateToModal({ name: 'report-modal', entryId, itemType });
  };

  const handleFlipCard = () => {
    setShowAnyway(true);
  };

  const handleCommentRemove = (commentId: string) => {
    props.navigateToModal({
      name: 'entry-remove-confirmation',
      entryType: EntityTypes.COMMENT,
      entryId: commentId,
    });
  };

  return (
    <BasicCardBox style={{ height: 'auto' }} overflow="hidden">
      {children}
      {entryReq.isLoading && <EntryCardLoading />}
      {entryReq.isError && (
        <ErrorLoader
          type="script-error"
          title={t('There was an error loading the entry')}
          details={t('We cannot show this entry right now')}
          devDetails={entryReq.error}
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
          <Entry
            postId={postId}
            replyTo={replyTo}
            entryType={entryType}
            entryReq={entryReq}
            loginState={loginState}
            uiEvents={props.uiEvents}
            plugins={props.plugins}
            singleSpa={props.singleSpa}
            layoutConfig={props.layoutConfig}
            entryData={entryData}
            navigateToModal={props.navigateToModal}
            showLoginModal={props.showLoginModal}
          />
          <PendingReply
            postId={postId}
            layoutConfig={props.layoutConfig}
            loggedProfileData={loggedProfileData}
            entryData={entryData}
          />
          <FeedWidget
            modalSlotId={props.layoutConfig.modalSlotId}
            logger={logger}
            pages={commentPages}
            itemType={EntityTypes.COMMENT}
            onLoadMore={handleLoadMore}
            getShareUrl={(itemId: string) =>
              `${window.location.origin}/@akashaorg/app-akasha-integration/reply/${itemId}`
            }
            loginState={loginState}
            navigateTo={navigateTo}
            navigateToModal={props.navigateToModal}
            onLoginModalOpen={showLoginModal}
            requestStatus={reqComments.status}
            hasNextPage={reqComments.hasNextPage}
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
          />
        </>
      )}
    </BasicCardBox>
  );
};

export default BaseEntryPage;

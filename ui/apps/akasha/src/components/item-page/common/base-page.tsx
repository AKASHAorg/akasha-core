import React from 'react';
import { UseQueryResult } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import ErrorLoader from '@akashaorg/design-system-core/lib/components/ErrorLoader';
import EntryCardHidden from '@akashaorg/design-system-components/lib/components/Entry/EntryCardHidden';
import EntryCardLoading from '@akashaorg/design-system-components/lib/components/Entry/EntryCardLoading';
import BasicCardBox from '@akashaorg/design-system-core/lib/components/BasicCardBox';
import { Logger } from '@akashaorg/awf-sdk';
import { useAnalytics, useEntryNavigation } from '@akashaorg/ui-awf-hooks';
import FeedWidget from '@akashaorg/ui-lib-feed/lib/components/app';
import { useInfiniteComments } from '@akashaorg/ui-awf-hooks';
import { useInfiniteReplies } from '@akashaorg/ui-awf-hooks/lib/use-comments';
import { useGetMyProfileQuery } from '@akashaorg/ui-awf-hooks/lib/generated/hooks-new';
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
    plugins,
    children,
    layoutConfig,
    uiEvents,
    navigateToModal,
  } = props;
  const navigateTo = plugins['@akashaorg/app-routing']?.routing?.navigateTo;
  const [showAnyway, setShowAnyway] = React.useState<boolean>(false);
  const { t } = useTranslation('app-akasha-integration');

  const isReported = React.useMemo(() => {
    if (showAnyway) {
      return false;
    }
    return entryReq.isSuccess && entryData?.reported;
  }, [entryData?.reported, showAnyway, entryReq.isSuccess]);
  // @TODO replace with new hooks
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

  const profileDataReq = useGetMyProfileQuery(null, {
    select: resp => {
      return resp.viewer?.profile;
    },
  });
  const loggedProfileData = profileDataReq.data;

  const handleEntryFlag = (itemId: string, itemType: EntityTypes) => () => {
    if (!loggedProfileData?.did?.id) {
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
      itemType: EntityTypes.REFLECT,
      itemId: commentId,
    });
  };

  return (
    <BasicCardBox customStyle="h-auto overflow-hidden" pad="p-0">
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
        loggedProfileData={loggedProfileData}
        uiEvents={uiEvents}
        plugins={plugins}
        layoutConfig={layoutConfig}
        entryData={entryData}
        navigateToModal={navigateToModal}
        showLoginModal={showLoginModal}
      />
      <PendingReply
        postId={postId}
        loggedProfileData={loggedProfileData}
        commentIds={commentPages[0]?.results || []}
      />
      <FeedWidget
        modalSlotId={layoutConfig.modalSlotId}
        itemType={EntityTypes.REFLECT}
        loggedProfileData={loggedProfileData}
        navigateTo={navigateTo}
        navigateToModal={navigateToModal}
        onLoginModalOpen={showLoginModal}
        onEntryFlag={handleEntryFlag}
        onEntryRemove={handleCommentRemove}
        uiEvents={uiEvents}
        itemSpacing={8}
        i18n={plugins['@akashaorg/app-translation']?.translation?.i18n}
        trackEvent={analyticsActions.trackEvent}
        onNavigate={useEntryNavigation(plugins['@akashaorg/app-routing']?.routing.navigateTo)}
      />
    </BasicCardBox>
  );
};

export default BaseEntryPage;

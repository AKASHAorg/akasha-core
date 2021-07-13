import * as React from 'react';
import DS from '@akashaproject/design-system';
import { useTranslation } from 'react-i18next';
import {
  ILoadItemDataPayload,
  ILoadItemsPayload,
} from '@akashaproject/design-system/lib/components/VirtualList/interfaces';
import { ILocale } from '@akashaproject/design-system/lib/utils/time';
import { IAkashaError, RootComponentProps } from '@akashaproject/ui-awf-typings';
import getSDK from '@akashaproject/awf-sdk';
import { getFeedCustomEntities } from './feed-page-custom-entities';
import { redirectToPost } from '../../services/routing-service';
import EntryCardRenderer from './entry-card-renderer';
import routes, { POST } from '../../routes';
// import { application as loginWidget } from '@akashaproject/ui-widget-login-cta/lib';
// import Parcel from 'single-spa-react/parcel';
import { constants, useBookmarks, useErrors, usePosts } from '@akashaproject/ui-awf-hooks';
import { ILoginState } from '@akashaproject/ui-awf-hooks/lib/use-login-state';

const {
  Box,
  Helmet,
  VirtualList,
  ReportModal,
  ToastProvider,
  ModalRenderer,
  EditorPlaceholder,
} = DS;

export interface FeedPageProps {
  singleSpa: any;
  logger: any;
  showLoginModal: () => void;
  loggedProfileData?: any;
  loginState: ILoginState;
  flagged: string;
  flaggedContentType: string;
  reportModalOpen: boolean;
  setFlagged: React.Dispatch<React.SetStateAction<string>>;
  setFlaggedContentType: React.Dispatch<React.SetStateAction<string>>;
  setReportModalOpen: () => void;
  closeReportModal: () => void;
  editorModalOpen: boolean;
  setEditorModalOpen: () => void;
  closeEditorModal: () => void;
  onError: (err: IAkashaError) => void;
}

const FeedPage: React.FC<FeedPageProps & RootComponentProps> = props => {
  const {
    isMobile,
    flagged,
    flaggedContentType,
    reportModalOpen,
    setFlagged,
    setFlaggedContentType,
    setReportModalOpen,
    closeReportModal,
    showLoginModal,
    loggedProfileData,
    loginState,
    onError,
    logger,
  } = props;

  const sdk = getSDK();

  const { t, i18n } = useTranslation();
  const locale = (i18n.languages[0] || 'en') as ILocale;

  const [bookmarkState, bookmarkActions] = useBookmarks({
    onError,
  });
  const [errorState, errorActions] = useErrors({ logger });

  const [postsState, postsActions] = usePosts({
    user: loginState.ethAddress,
    onError: errorActions.createError,
  });

  React.useEffect(() => {
    if (Object.keys(errorState).length) {
      logger.error(errorState);
    }
  }, [JSON.stringify(errorState)]);

  React.useEffect(() => {
    if (loginState.currentUserCalled) {
      postsActions.resetPostIds();
      if (loginState.ready) {
        bookmarkActions.getBookmarks();
      }
    }
  }, [JSON.stringify(loginState)]);

  React.useEffect(() => {
    if (
      !postsState.postIds.length &&
      !postsState.isFetchingPosts &&
      postsState.totalItems === null
    ) {
      postsActions.getPosts({ limit: 5 });
    }
  }, [postsState.postIds.length, postsState.isFetchingPosts]);

  const handleLoadMore = (payload: ILoadItemsPayload) => {
    const req: { limit: number; offset?: string } = {
      limit: payload.limit,
    };
    if (!postsState.isFetchingPosts && loginState.currentUserCalled) {
      postsActions.getPosts(req);
    }
  };

  const loadItemData = (payload: ILoadItemDataPayload) => {
    postsActions.getPost(payload.itemId);
  };

  const handleAvatarClick = (ev: React.MouseEvent<HTMLDivElement>, authorPubKey: string) => {
    props.singleSpa.navigateToUrl(`/profile/${authorPubKey}`);
    ev.preventDefault();
  };
  const handleMentionClick = (profilePubKey: string) => {
    props.singleSpa.navigateToUrl(`/profile/${profilePubKey}`);
  };

  const handleTagClick = (name: string) => {
    props.singleSpa.navigateToUrl(`/social-app/tags/${name}`);
  };
  const handleEntryBookmark = (entryId: string) => {
    if (!loginState.pubKey) {
      return showLoginModal();
    }
    if (bookmarkState.bookmarks.findIndex(bm => bm.entryId === entryId) >= 0) {
      return bookmarkActions.removeBookmark(entryId);
    }
    return bookmarkActions.bookmarkPost(entryId);
  };

  const handleShowEditor = () => {
    props.navigateToModal({ name: 'editor' });
  };

  const handleEntryRepost = (_withComment: boolean, entryData: any) => {
    props.navigateToModal({ name: 'editor', embedEntry: entryData });
  };

  const handleEntryFlag = (entryId: string, contentType: string) => () => {
    setFlagged(entryId);
    setFlaggedContentType(contentType);
    setReportModalOpen();
  };

  const handleNavigateToPost = redirectToPost(props.singleSpa.navigateToUrl);

  const handleFlipCard = (entry: any, isQuote: boolean) => () => {
    const modifiedEntry = isQuote
      ? { ...entry, quote: { ...entry.quote, reported: false } }
      : { ...entry, reported: false };
    postsActions.updatePostsState(modifiedEntry);
  };

  const updateEntry = (entryId: string) => {
    const modifiedEntry = { ...postsState.postsData[entryId], reported: true };
    postsActions.updatePostsState(modifiedEntry);
  };

  return (
    <Box fill="horizontal">
      <Helmet>
        <title>Ethereum World</title>
      </Helmet>
      <ModalRenderer slotId={props.layoutConfig.modalSlotId}>
        {reportModalOpen && (
          <ToastProvider autoDismiss={true} autoDismissTimeout={5000}>
            <ReportModal
              titleLabel={t(`Report ${flaggedContentType}`)}
              successTitleLabel={t('Thank you for helping us keep Ethereum World safe! 🙌')}
              successMessageLabel={t('We will investigate this post and take appropriate action.')}
              optionsTitleLabel={t('Please select a reason')}
              optionLabels={[
                t('Threats of violence and incitement'),
                t('Hate speech, bullying and harassment'),
                t('Sexual or human exploitation'),
                t('Illegal or certain regulated goods or services'),
                t('Impersonation'),
                t('Spam and malicious links'),
                t('Privacy and copyright infringement'),
                t('Other'),
              ]}
              optionValues={[
                'Threats of violence and incitement',
                'Hate speech, bullying and harassment',
                'Sexual or human exploitation',
                'Illegal or certain regulated goods or services',
                'Impersonation',
                'Spam and malicious links',
                'Privacy and copyright infringement',
                'Other',
              ]}
              descriptionLabel={t('Explanation')}
              descriptionPlaceholder={t('Please explain your reason(s)')}
              footerText1Label={t('If you are unsure, you can refer to our')}
              footerLink1Label={t('Code of Conduct')}
              footerUrl1={'/legal/code-of-conduct'}
              cancelLabel={t('Cancel')}
              reportLabel={t('Report')}
              blockLabel={t('Block User')}
              closeLabel={t('Close')}
              user={loginState.ethAddress ? loginState.ethAddress : ''}
              contentId={flagged}
              contentType={flaggedContentType}
              baseUrl={constants.BASE_REPORT_URL}
              updateEntry={updateEntry}
              closeModal={closeReportModal}
              signData={sdk.api.auth.signData}
            />
          </ToastProvider>
        )}
      </ModalRenderer>

      <VirtualList
        items={postsState.postIds}
        itemsData={postsState.postsData}
        loadMore={handleLoadMore}
        loadItemData={loadItemData}
        hasMoreItems={!!postsState.nextPostIndex}
        usePlaceholders={true}
        listHeader={
          loginState.ethAddress ? (
            <EditorPlaceholder
              ethAddress={loginState.ethAddress}
              onClick={handleShowEditor}
              avatar={loggedProfileData.avatar}
            />
          ) : (
            <>
              {/* <Parcel
                config={loginWidget.loadingFn}
                wrapWith="div"
                sdkModules={props.sdkModules}
                logger={props.logger}
                layout={props.layoutConfig}
                globalChannel={props.globalChannel}
                i18n={props.i18n}
                mountParcel={props.singleSpa.mountRootParcel}
              /> */}
            </>
          )
        }
        itemCard={
          <EntryCardRenderer
            logger={logger}
            bookmarkState={bookmarkState}
            ethAddress={loginState.ethAddress}
            locale={locale}
            onBookmark={handleEntryBookmark}
            onNavigate={handleNavigateToPost}
            singleSpaNavigate={props.singleSpa.navigateToUrl}
            onFlag={handleEntryFlag}
            onRepost={handleEntryRepost}
            sharePostUrl={`${window.location.origin}${routes[POST]}/`}
            onAvatarClick={handleAvatarClick}
            onMentionClick={handleMentionClick}
            onTagClick={handleTagClick}
            contentClickable={true}
            awaitingModerationLabel={t(
              'You have reported this content. It is awaiting moderation.',
            )}
            moderatedContentLabel={t('This content has been moderated')}
            ctaLabel={t('See it anyway')}
            handleFlipCard={handleFlipCard}
          />
        }
        customEntities={getFeedCustomEntities({
          logger,
          isMobile,
          feedItems: postsState.postIds,
          loggedEthAddress: loginState.ethAddress,
          pendingEntries: postsState.pendingPosts,
        })}
      />
    </Box>
  );
};

export default FeedPage;
